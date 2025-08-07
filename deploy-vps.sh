#!/bin/bash

# Lemmi Run - VPS Deployment Script
# Server: Debian 12 (ssh root@145.79.15.245)

echo "🚀 Starting Lemmi Run deployment to VPS..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Server configuration
VPS_HOST="145.79.15.245"
VPS_USER="root"
APP_NAME="lemmi-run"
APP_DIR="/var/www/$APP_NAME"
DOMAIN="lemmi-run.hetgr.cloud"
PORT="3000"

echo -e "${BLUE}Deploying to: ${VPS_HOST}${NC}"
echo -e "${BLUE}Application: ${APP_NAME}${NC}"
echo -e "${BLUE}Directory: ${APP_DIR}${NC}"

# Function to run commands on VPS
run_remote() {
    ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_HOST "$1"
}

# Function to copy files to VPS
copy_files() {
    rsync -avz --delete \
        --exclude 'node_modules' \
        --exclude '.git' \
        --exclude 'dist' \
        --exclude '.env.local' \
        --exclude '*.log' \
        ./ $VPS_USER@$VPS_HOST:$APP_DIR/
}

echo -e "${YELLOW}Step 1: Installing system dependencies...${NC}"
run_remote "
    apt update && apt upgrade -y
    apt install -y nginx nodejs npm git curl htop ufw
    
    # Install latest Node.js (v20+)
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
    
    # Install PM2 for process management
    npm install -g pm2
    
    # Configure firewall
    ufw allow 22
    ufw allow 80
    ufw allow 443
    ufw allow $PORT
    ufw --force enable
"

echo -e "${YELLOW}Step 2: Creating application directory...${NC}"
run_remote "
    mkdir -p $APP_DIR
    chown -R www-data:www-data $APP_DIR
"

echo -e "${YELLOW}Step 3: Copying application files...${NC}"
copy_files

echo -e "${YELLOW}Step 4: Installing dependencies and building...${NC}"
run_remote "
    cd $APP_DIR
    npm install
    npm run build
    chown -R www-data:www-data $APP_DIR
"

echo -e "${YELLOW}Step 5: Creating PM2 ecosystem file...${NC}"
run_remote "cat > $APP_DIR/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: '$APP_NAME',
    script: 'server/index.ts',
    interpreter: 'node',
    interpreter_args: '--loader tsx',
    cwd: '$APP_DIR',
    instances: 1,
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: '$PORT',
      HOST: '0.0.0.0'
    },
    error_file: '/var/log/pm2/$APP_NAME-error.log',
    out_file: '/var/log/pm2/$APP_NAME-out.log',
    log_file: '/var/log/pm2/$APP_NAME.log',
    time: true
  }]
};
EOF"

echo -e "${YELLOW}Step 6: Setting up Nginx configuration...${NC}"
run_remote "cat > /etc/nginx/sites-available/$APP_NAME << 'EOF'
server {
    listen 80;
    server_name $DOMAIN $VPS_HOST;
    
    # Security headers
    add_header X-Frame-Options \"SAMEORIGIN\" always;
    add_header X-Content-Type-Options \"nosniff\" always;
    add_header X-XSS-Protection \"1; mode=block\" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Static files
    location /assets/ {
        root $APP_DIR/dist;
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }
    
    # Character and texture files
    location ~* \.(fbx|png|jpg|jpeg|webp|gif)$ {
        root $APP_DIR/public;
        expires 1y;
        add_header Cache-Control \"public\";
    }
    
    # API routes
    location /api/ {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Main app
    location / {
        proxy_pass http://localhost:$PORT;
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
EOF"

echo -e "${YELLOW}Step 7: Enabling Nginx site...${NC}"
run_remote "
    ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    nginx -t && systemctl restart nginx
    systemctl enable nginx
"

echo -e "${YELLOW}Step 8: Starting application with PM2...${NC}"
run_remote "
    cd $APP_DIR
    pm2 delete $APP_NAME 2>/dev/null || true
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup systemd -u root --hp /root
"

echo -e "${YELLOW}Step 9: Setting up log rotation...${NC}"
run_remote "
    mkdir -p /var/log/pm2
    cat > /etc/logrotate.d/$APP_NAME << 'EOF'
/var/log/pm2/$APP_NAME*.log {
    daily
    missingok
    rotate 7
    compress
    notifempty
    create 644 root root
    postrotate
        pm2 reloadLogs
    endscript
}
EOF"

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}Application URLs:${NC}"
echo -e "  🌐 Main: http://$DOMAIN"
echo -e "  🌐 IP: http://$VPS_HOST"
echo -e "  🔧 Direct: http://$VPS_HOST:$PORT"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo -e "  📊 View logs: ssh $VPS_USER@$VPS_HOST 'pm2 logs $APP_NAME'"
echo -e "  🔄 Restart: ssh $VPS_USER@$VPS_HOST 'pm2 restart $APP_NAME'"
echo -e "  📈 Monitor: ssh $VPS_USER@$VPS_HOST 'pm2 monit'"
echo -e "  🏠 Status: ssh $VPS_USER@$VPS_HOST 'pm2 status'"
echo ""

# Show final status
echo -e "${YELLOW}Checking deployment status...${NC}"
run_remote "
    echo -e '${BLUE}PM2 Status:${NC}'
    pm2 status
    echo -e '${BLUE}Nginx Status:${NC}'
    systemctl status nginx --no-pager
    echo -e '${BLUE}Application Logs (last 10 lines):${NC}'
    pm2 logs $APP_NAME --lines 10 --nostream
"

echo -e "${GREEN}🎮 Lemmi Run is now live! Access it at: http://$DOMAIN${NC}"