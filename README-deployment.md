# Lemmi Run - VPS Deployment Guide

Panduan deployment Lemmi Run ke VPS Debian 12 dengan IP: 145.79.15.245

## Prerequisites

1. **VPS dengan spesifikasi:**
   - OS: Debian 12
   - RAM: Minimal 1GB (direkomendasikan 2GB+)
   - Storage: Minimal 10GB free space
   - IP: 145.79.15.245

2. **Local setup:**
   - SSH access ke VPS
   - Git installed
   - rsync installed

## Deployment Options

### Option 1: Simple Deployment (Recommended)

Menggunakan PM2 dan Nginx, lebih ringan dan mudah dikelola:

```bash
# Make script executable
chmod +x deploy-simple.sh

# Run deployment
./deploy-simple.sh
```

### Option 2: Docker Deployment

Menggunakan Docker dan Docker Compose:

```bash
# Make script executable  
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

## Manual Deployment Steps

Jika ingin deploy manual:

### 1. Upload files to VPS

```bash
rsync -avz --exclude='node_modules' --exclude='.git' ./ root@145.79.15.245:/var/www/lemmi-run/
```

### 2. SSH to VPS and setup

```bash
ssh root@145.79.15.245

cd /var/www/lemmi-run

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 3. Setup Nginx

```bash
# Install Nginx
apt-get update && apt-get install -y nginx

# Create Nginx config
nano /etc/nginx/sites-available/lemmi-run

# Copy configuration from deploy script

# Enable site
ln -s /etc/nginx/sites-available/lemmi-run /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Restart Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx
```

### 4. Setup Firewall

```bash
ufw allow 22
ufw allow 80  
ufw allow 443
ufw --force enable
```

## Post Deployment

### Check Application Status

```bash
# Check PM2 status
pm2 status
pm2 logs lemmi-run

# Check Nginx status
systemctl status nginx

# Check application health
curl http://145.79.15.245/health
```

### Application URLs

- **Main Application:** http://145.79.15.245
- **Health Check:** http://145.79.15.245/health
- **API Endpoints:** http://145.79.15.245/api/*

## Management Commands

### PM2 Commands
```bash
pm2 status                 # Check status
pm2 logs lemmi-run         # View logs
pm2 restart lemmi-run      # Restart app
pm2 stop lemmi-run         # Stop app
pm2 delete lemmi-run       # Remove app
pm2 monit                  # Monitoring
```

### Nginx Commands
```bash
systemctl status nginx     # Check status
systemctl restart nginx   # Restart nginx
nginx -t                   # Test configuration
tail -f /var/log/nginx/access.log  # View access logs
```

### System Monitoring
```bash
htop                       # System resources
df -h                      # Disk space
free -h                    # Memory usage
netstat -tlnp              # Check ports
```

## SSL Setup (Optional)

### Install Certbot
```bash
apt-get install -y certbot python3-certbot-nginx
```

### Get SSL Certificate
```bash
certbot --nginx -d your-domain.com
```

## Troubleshooting

### Common Issues

1. **Port 3000 not accessible**
   - Check if PM2 is running: `pm2 status`
   - Check firewall: `ufw status`
   - Check application logs: `pm2 logs lemmi-run`

2. **Nginx 502 Bad Gateway**
   - Ensure app is running on port 3000
   - Check Nginx configuration: `nginx -t`
   - Check Nginx error logs: `tail -f /var/log/nginx/error.log`

3. **Application crashes**
   - Check PM2 logs: `pm2 logs lemmi-run`
   - Check system resources: `htop`
   - Restart application: `pm2 restart lemmi-run`

### Log Locations

- **PM2 Logs:** `/var/www/lemmi-run/logs/`
- **Nginx Access:** `/var/log/nginx/access.log`
- **Nginx Error:** `/var/log/nginx/error.log`
- **System:** `/var/log/syslog`

## Security Notes

- UFW firewall enabled with only necessary ports
- Nginx configured with security headers
- PM2 runs application with proper process management
- Regular updates recommended: `apt-get update && apt-get upgrade`

## Performance Optimization

### PM2 Cluster Mode
Application runs in cluster mode with all CPU cores for better performance.

### Nginx Caching
Static assets are served with appropriate cache headers.

### Memory Limits
PM2 configured with 1GB memory limit and auto-restart on memory exceeds.

## Support

Jika ada masalah dengan deployment, cek:

1. PM2 status dan logs
2. Nginx status dan configuration
3. System resources (RAM, disk, CPU)
4. Firewall rules
5. Application health endpoint

Aplikasi Lemmi Run sudah siap digunakan di: **http://145.79.15.245**