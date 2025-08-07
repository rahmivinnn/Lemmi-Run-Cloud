#!/bin/bash

# Simple deployment script untuk VPS
set -e

echo "🏃 Starting Lemmi Run VPS Deployment..."

# Configuration
VPS_IP="145.79.15.245"
VPS_USER="root"
APP_NAME="lemmi-run"
DEPLOY_DIR="/var/www/lemmi-run"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Upload project files
print_status "Uploading files to VPS..."
rsync -avz --exclude='node_modules' --exclude='.git' --exclude='dist' --exclude='*.log' \
    ./ ${VPS_USER}@${VPS_IP}:${DEPLOY_DIR}/

# Execute commands on VPS
print_status "Setting up application on VPS..."
ssh ${VPS_USER}@${VPS_IP} << 'ENDSSH'

set -e

# Navigate to app directory
cd /var/www/lemmi-run

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building application..."
npm run build

# Create logs directory
mkdir -p logs

# Stop existing PM2 process
pm2 stop lemmi-run || true
pm2 delete lemmi-run || true

# Start application with PM2
echo "Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
pm2 startup

# Setup Nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    apt-get update
    apt-get install -y nginx
fi

# Create Nginx configuration
cat > /etc/nginx/sites-available/lemmi-run << 'EOF'
server {
    listen 80;
    server_name 145.79.15.245;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /health {
        proxy_pass http://localhost:3000/health;
        access_log off;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/lemmi-run /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx

# Setup firewall
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

echo "✅ Deployment completed!"
echo "Application is running at: http://145.79.15.245"
echo ""
echo "Useful commands:"
echo "- pm2 status          # Check application status"
echo "- pm2 logs lemmi-run  # View logs"
echo "- pm2 restart lemmi-run # Restart app"
echo "- systemctl status nginx # Check nginx status"

ENDSSH

print_status "Deployment completed successfully!"
print_status "Your Lemmi Run application is now available at: http://145.79.15.245"
print_warning "Next steps:"
print_warning "1. Test the application in your browser"
print_warning "2. Set up SSL certificate if needed (Let's Encrypt recommended)"
print_warning "3. Configure domain DNS if you have one"