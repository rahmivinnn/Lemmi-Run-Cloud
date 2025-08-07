#!/bin/bash

# Create deployment package for VPS
echo "🚀 Creating deployment package for Lemmi Run..."

# Create deployment directory
mkdir -p deployment-package

# Copy essential files
echo "📦 Copying application files..."
cp -r client deployment-package/
cp -r server deployment-package/
cp -r public deployment-package/
cp -r shared deployment-package/
cp package.json deployment-package/
cp package-production.json deployment-package/
cp tsconfig.json deployment-package/
cp vite.config.ts deployment-package/
cp tailwind.config.ts deployment-package/
cp postcss.config.js deployment-package/
cp components.json deployment-package/
cp drizzle.config.ts deployment-package/

# Copy built files if available
if [ -d "dist" ]; then
    cp -r dist deployment-package/
fi

# Create VPS deployment script
cat > deployment-package/deploy-on-vps.sh << 'EOF'
#!/bin/bash

echo "🚀 Deploying Lemmi Run on VPS..."

# Install Node.js 20 if not installed
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
    sudo apt install -y nodejs
fi

# Install PM2 globally
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build application
echo "Building application..."
npm run build

# Create PM2 ecosystem
cat > ecosystem.config.js << 'ECOEOF'
module.exports = {
  apps: [{
    name: 'lemmi-run',
    script: 'server/index.ts',
    interpreter: 'node',
    interpreter_args: '--loader tsx',
    instances: 1,
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '0.0.0.0'
    }
  }]
};
ECOEOF

# Start with PM2
echo "Starting application..."
pm2 delete lemmi-run 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "✅ Deployment completed!"
echo "🌐 Application running at: http://localhost:3000"
echo "📊 Monitor: pm2 monit"
echo "📝 Logs: pm2 logs lemmi-run"
EOF

chmod +x deployment-package/deploy-on-vps.sh

# Create nginx config
cat > deployment-package/nginx-lemmi-run.conf << 'EOF'
server {
    listen 80;
    server_name lemmi-run.hetgr.cloud 145.79.15.245;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Static files
    location /assets/ {
        root /var/www/lemmi-run/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Character and texture files
    location ~* \.(fbx|png|jpg|jpeg|webp|gif)$ {
        root /var/www/lemmi-run/public;
        expires 1y;
        add_header Cache-Control "public";
    }
    
    # API routes
    location /api/ {
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
    
    # Main app
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
}
EOF

# Create deployment instructions
cat > deployment-package/README.md << 'EOF'
# 🚀 Lemmi Run - VPS Deployment Package

## Quick Deployment Steps

### 1. Upload this package to your VPS
```bash
# On your local machine, upload to VPS:
scp -r deployment-package root@145.79.15.245:/var/www/lemmi-run
```

### 2. SSH to your VPS and deploy
```bash
# SSH to VPS
ssh root@145.79.15.245

# Go to application directory
cd /var/www/lemmi-run

# Run deployment script
chmod +x deploy-on-vps.sh
./deploy-on-vps.sh
```

### 3. Setup Nginx (Optional)
```bash
# Install Nginx
sudo apt install -y nginx

# Copy nginx config
sudo cp nginx-lemmi-run.conf /etc/nginx/sites-available/lemmi-run
sudo ln -s /etc/nginx/sites-available/lemmi-run /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 4. Configure Firewall
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw --force enable
```

## Access URLs
- Direct: http://145.79.15.245:3000
- With Nginx: http://145.79.15.245
- Domain: http://lemmi-run.hetgr.cloud

## Management
```bash
pm2 status          # Check status
pm2 logs lemmi-run   # View logs
pm2 restart lemmi-run # Restart app
pm2 monit           # Monitor
```
EOF

# Create archive
echo "📦 Creating deployment archive..."
tar -czf lemmi-run-deployment.tar.gz deployment-package/

echo "✅ Deployment package created!"
echo "📦 File: lemmi-run-deployment.tar.gz"
echo "📁 Directory: deployment-package/"
echo ""
echo "🚀 Next steps:"
echo "1. Download lemmi-run-deployment.tar.gz"
echo "2. Upload to your VPS: scp lemmi-run-deployment.tar.gz root@145.79.15.245:~/"
echo "3. SSH to VPS and extract: tar -xzf lemmi-run-deployment.tar.gz"
echo "4. Run: cd lemmi-run-deployment && ./deploy-on-vps.sh"