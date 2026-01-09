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

APP_DIR="/var/www/puretickets"
NODE_VERSION="20"
PORT=3000
CURRENT_DIR=$(pwd)

# Detect package manager (dnf for newer, yum for older)
if command -v dnf &> /dev/null; then
    PKG_MGR="dnf"
else
    PKG_MGR="yum"
fi

echo -e "${YELLOW}[1/9] Updating system packages...${NC}"
sudo $PKG_MGR update -y

echo -e "${YELLOW}[2/9] Installing Node.js ${NODE_VERSION}...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_${NODE_VERSION}.x | sudo bash -
    sudo $PKG_MGR install -y nodejs
else
    echo "Node.js already installed: $(node -v)"
fi

echo -e "${YELLOW}[3/9] Installing PM2 process manager...${NC}"
sudo npm install -g pm2

echo -e "${YELLOW}[4/9] Installing Nginx...${NC}"
sudo $PKG_MGR install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

echo -e "${YELLOW}[5/9] Setting up application directory...${NC}"
sudo mkdir -p $APP_DIR

echo -e "${YELLOW}[6/9] Copying files to $APP_DIR...${NC}"
sudo cp -r "$CURRENT_DIR"/* $APP_DIR/
sudo chown -R $USER:$USER $APP_DIR

echo -e "${YELLOW}[7/9] Installing dependencies...${NC}"
cd $APP_DIR
npm install

echo -e "${YELLOW}[8/9] Building application...${NC}"
npm run build

echo -e "${YELLOW}[9/9] Configuring Nginx and starting app...${NC}"

sudo tee /etc/nginx/conf.d/puretickets.conf > /dev/null <<EOF
server {
    listen 80;
    server_name _;

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

# Start with PM2
pm2 delete puretickets 2>/dev/null || true
pm2 start npm --name "puretickets" -- start
pm2 save
pm2 startup

echo ""
echo -e "${GREEN}=========================================="
echo "  PureTickets Deployment Complete!"
echo "==========================================${NC}"
echo ""
echo "Your app is now running at: http://YOUR_SERVER_IP"
echo ""
echo -e "${YELLOW}To enable HTTPS with Let's Encrypt:${NC}"
echo "  sudo $PKG_MGR install -y certbot python3-certbot-nginx"
echo "  sudo certbot --nginx -d yourdomain.com"
echo ""
echo -e "${YELLOW}Useful PM2 commands:${NC}"
echo "  pm2 logs puretickets  - View app logs"
echo "  pm2 restart puretickets - Restart app"
echo "  pm2 status   - Check app status"
echo ""
