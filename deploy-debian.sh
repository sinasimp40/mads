#!/bin/bash

# PureTickets - Debian/Ubuntu Deployment Script
# Run this script on your Debian/Ubuntu VPS terminal

set -e

echo "=========================================="
echo "  PureTickets Deployment (Debian/Ubuntu)"
echo "=========================================="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

APP_DIR="/var/www/puretickets"
NODE_VERSION="20"
PORT=3000

echo -e "${YELLOW}[1/8] Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

echo -e "${YELLOW}[2/8] Installing Node.js ${NODE_VERSION}...${NC}"
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
sudo apt install -y nodejs

echo -e "${YELLOW}[3/8] Installing PM2 process manager...${NC}"
sudo npm install -g pm2

echo -e "${YELLOW}[4/8] Installing Nginx...${NC}"
sudo apt install -y nginx

echo -e "${YELLOW}[5/8] Setting up application directory...${NC}"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

echo -e "${YELLOW}[6/8] Installing dependencies...${NC}"
cd $APP_DIR
npm install

echo -e "${YELLOW}[7/8] Building application...${NC}"
npm run build

echo -e "${YELLOW}[8/8] Configuring Nginx...${NC}"

sudo tee /etc/nginx/sites-available/puretickets > /dev/null <<EOF
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

sudo ln -sf /etc/nginx/sites-available/puretickets /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

pm2 delete puretickets 2>/dev/null || true
pm2 start npm --name "puretickets" -- start
pm2 save
pm2 startup

echo ""
echo -e "${GREEN}=========================================="
echo "  PureTickets Deployment Complete!"
echo "==========================================${NC}"
echo ""
echo "Your app is now running on port ${PORT}"
echo ""
echo -e "${YELLOW}To enable HTTPS with Let's Encrypt, run:${NC}"
echo "  sudo apt install certbot python3-certbot-nginx"
echo "  sudo certbot --nginx -d yourdomain.com"
echo ""
echo -e "${YELLOW}Useful PM2 commands:${NC}"
echo "  pm2 logs     - View application logs"
echo "  pm2 restart puretickets - Restart app"
echo "  pm2 status   - Check app status"
echo ""
