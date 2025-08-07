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
