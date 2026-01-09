#!/bin/bash

# PureTickets - CentOS/RHEL/AlmaLinux Deployment Script
# 
# INSTRUCTIONS:
# 1. Upload ALL your project files (including this script) to your server
# 2. SSH into your server
# 3. cd to the folder with your files
# 4. Run: chmod +x deploy-centos.sh && ./deploy-centos.sh

set -e

echo "=========================================="
echo "  PureTickets Deployment (CentOS/RHEL)"
echo "=========================================="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if package.json exists in current directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found!${NC}"
    echo ""
    echo "Make sure you run this script from the folder containing your app files."
    echo "Upload all your project files first, then run this script."
    exit 1
fi

# Ask for domain name
echo ""
echo -e "${YELLOW}Enter your domain name (e.g., puretickets.com):${NC}"
echo -e "(Leave empty to skip HTTPS setup)"
read -p "Domain: " DOMAIN_NAME

APP_DIR="/var/www/puretickets"
NODE_VERSION="20"
PORT=3000
CURRENT_DIR=$(pwd)

# Generate random password for database
DB_PASSWORD=$(openssl rand -base64 12 | tr -dc 'a-zA-Z0-9' | head -c 16)
DB_NAME="puretickets"
DB_USER="puretickets"
DATABASE_URL="postgres://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}"

# Detect package manager (dnf for newer, yum for older)
if command -v dnf &> /dev/null; then
    PKG_MGR="dnf"
else
    PKG_MGR="yum"
fi

echo -e "${YELLOW}[1/12] Updating system packages...${NC}"
sudo $PKG_MGR update -y

echo -e "${YELLOW}[2/12] Installing Node.js ${NODE_VERSION}...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_${NODE_VERSION}.x | sudo bash -
    sudo $PKG_MGR install -y nodejs
else
    echo "Node.js already installed: $(node -v)"
fi

echo -e "${YELLOW}[3/12] Installing PM2 process manager...${NC}"
sudo npm install -g pm2

echo -e "${YELLOW}[4/12] Installing Nginx...${NC}"
sudo $PKG_MGR install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

echo -e "${YELLOW}[5/12] Installing PostgreSQL...${NC}"
sudo $PKG_MGR install -y postgresql-server postgresql

# Initialize PostgreSQL if not already done
if [ ! -f "/var/lib/pgsql/data/PG_VERSION" ]; then
    sudo postgresql-setup --initdb
fi

# Stop PostgreSQL to modify config
sudo systemctl stop postgresql 2>/dev/null || true

# ALWAYS update pg_hba.conf to allow trust for local postgres user
echo -e "${YELLOW}Configuring PostgreSQL authentication...${NC}"
sudo bash -c 'cat > /var/lib/pgsql/data/pg_hba.conf << PGEOF
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             postgres                                trust
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
PGEOF'

sudo chown postgres:postgres /var/lib/pgsql/data/pg_hba.conf
sudo chmod 600 /var/lib/pgsql/data/pg_hba.conf

sudo systemctl enable postgresql
sudo systemctl start postgresql

# Wait for PostgreSQL to start
sleep 2

echo -e "${YELLOW}[6/12] Creating fresh database...${NC}"
# Force disconnect all users and drop old database
sudo su - postgres -c "psql -c \"SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME';\"" 2>/dev/null || true
sudo su - postgres -c "psql -c \"DROP DATABASE IF EXISTS $DB_NAME;\""
sudo su - postgres -c "psql -c \"DROP USER IF EXISTS $DB_USER;\"" 2>/dev/null || true
sudo su - postgres -c "psql -c \"CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';\""
sudo su - postgres -c "psql -c \"CREATE DATABASE $DB_NAME OWNER $DB_USER;\""
sudo su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;\""

echo -e "${GREEN}Fresh database created successfully!${NC}"

echo -e "${YELLOW}[7/12] Setting up application directory...${NC}"
sudo mkdir -p $APP_DIR

echo -e "${YELLOW}[8/12] Copying files to $APP_DIR...${NC}"
sudo rm -rf $APP_DIR/* 2>/dev/null || true
sudo cp -r "$CURRENT_DIR"/* $APP_DIR/
sudo chown -R $USER:$USER $APP_DIR

echo -e "${YELLOW}[9/12] Configuring environment...${NC}"
# Create .env file
cat > $APP_DIR/.env << ENVEOF
DATABASE_URL=${DATABASE_URL}
NODE_ENV=production
PORT=${PORT}
ENVEOF

# Create PM2 ecosystem file with environment variables baked in (.cjs for ES module compatibility)
cat > $APP_DIR/ecosystem.config.cjs << ECOEOF
module.exports = {
  apps: [{
    name: 'puretickets',
    script: 'npm',
    args: 'start',
    cwd: '${APP_DIR}',
    env: {
      NODE_ENV: 'production',
      PORT: ${PORT},
      DATABASE_URL: '${DATABASE_URL}'
    }
  }]
};
ECOEOF

echo -e "${GREEN}Environment configured!${NC}"

echo -e "${YELLOW}[10/12] Installing dependencies and building...${NC}"
cd $APP_DIR
npm install
npm run build

echo -e "${YELLOW}Creating database tables...${NC}"
npm run db:push

echo -e "${YELLOW}[11/12] Configuring Nginx...${NC}"

# Use domain name if provided, otherwise use _ for any host
if [ -n "$DOMAIN_NAME" ]; then
    SERVER_NAME="$DOMAIN_NAME"
else
    SERVER_NAME="_"
fi

sudo tee /etc/nginx/conf.d/puretickets.conf > /dev/null <<EOF
server {
    listen 80;
    server_name ${SERVER_NAME};

    location / {
        proxy_pass http://localhost:${PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo rm -f /etc/nginx/conf.d/default.conf 2>/dev/null || true

# Configure SELinux to allow nginx proxy (if SELinux is enabled)
if command -v setsebool &> /dev/null; then
    sudo setsebool -P httpd_can_network_connect 1 2>/dev/null || true
fi

# Configure firewall
if command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --permanent --add-service=http 2>/dev/null || true
    sudo firewall-cmd --permanent --add-service=https 2>/dev/null || true
    sudo firewall-cmd --reload 2>/dev/null || true
fi

sudo nginx -t && sudo systemctl restart nginx

# Start with PM2 using ecosystem file
cd $APP_DIR
pm2 delete puretickets 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup

# Setup HTTPS if domain was provided
if [ -n "$DOMAIN_NAME" ]; then
    echo -e "${YELLOW}[12/12] Setting up HTTPS with Let's Encrypt...${NC}"
    
    # Install certbot
    sudo $PKG_MGR install -y certbot python3-certbot-nginx
    
    # Get SSL certificate (non-interactive)
    echo -e "${YELLOW}Obtaining SSL certificate for ${DOMAIN_NAME}...${NC}"
    sudo certbot --nginx -d "$DOMAIN_NAME" --non-interactive --agree-tos --register-unsafely-without-email --redirect
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}HTTPS enabled successfully!${NC}"
        
        # Setup auto-renewal
        echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo tee /etc/cron.d/certbot-renew > /dev/null
        
        SITE_URL="https://${DOMAIN_NAME}"
    else
        echo -e "${RED}Failed to obtain SSL certificate. Site is available via HTTP.${NC}"
        SITE_URL="http://${DOMAIN_NAME}"
    fi
else
    echo -e "${YELLOW}[12/12] Skipping HTTPS (no domain provided)...${NC}"
    SITE_URL="http://YOUR_SERVER_IP"
fi

echo ""
echo -e "${GREEN}=========================================="
echo "  PureTickets Deployment Complete!"
echo "==========================================${NC}"
echo ""
echo -e "Your app is now running at: ${GREEN}${SITE_URL}${NC}"
echo ""
echo -e "${YELLOW}Database credentials (save these!):${NC}"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo "  Password: $DB_PASSWORD"
echo "  Connection: $DATABASE_URL"
echo ""
if [ -n "$DOMAIN_NAME" ]; then
    echo -e "${GREEN}HTTPS is enabled with auto-renewal!${NC}"
    echo ""
fi
echo -e "${YELLOW}Useful PM2 commands:${NC}"
echo "  pm2 logs puretickets  - View app logs"
echo "  pm2 restart puretickets - Restart app"
echo "  pm2 status   - Check app status"
echo ""
