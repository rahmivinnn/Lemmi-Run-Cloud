# 🚀 Lemmi Run - VPS Deployment Guide

## Server Info
- **IP**: 145.79.15.245
- **OS**: Debian 12
- **User**: root
- **Domain**: lemmi-run.hetgr.cloud

## 📋 Prerequisites

1. **SSH Access**: Pastikan Anda bisa SSH ke server
```bash
ssh root@145.79.15.245
```

2. **Domain Setup** (Opsional): 
   - Point domain `lemmi-run.hetgr.cloud` ke IP `145.79.15.245`
   - Atau gunakan IP langsung

## 🔧 Deployment Steps

### Method 1: Automated Deployment (Recommended)

```bash
# Jalankan script deployment otomatis
./deploy-vps.sh
```

Script ini akan:
- Install Node.js 20+, Nginx, PM2
- Copy semua file aplikasi ke server
- Build aplikasi untuk production
- Setup Nginx reverse proxy
- Start aplikasi dengan PM2
- Configure auto-restart dan logs

### Method 2: Manual Deployment

Jika ingin deploy manual, ikuti langkah berikut:

#### 1. Connect to VPS
```bash
ssh root@145.79.15.245
```

#### 2. Install Dependencies
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx git

# Install PM2
npm install -g pm2
```

#### 3. Setup Application Directory
```bash
mkdir -p /var/www/lemmi-run
cd /var/www/lemmi-run
```

#### 4. Upload Files
Dari komputer lokal:
```bash
# Upload semua file ke server (ganti dengan path project Anda)
rsync -avz --exclude 'node_modules' --exclude '.git' \
    /path/to/lemmi-run/ root@145.79.15.245:/var/www/lemmi-run/
```

#### 5. Build Application
```bash
cd /var/www/lemmi-run
npm install
npm run build
```

#### 6. Setup PM2
```bash
# Start aplikasi dengan PM2
pm2 start server/index.ts --name lemmi-run --interpreter tsx
pm2 save
pm2 startup
```

#### 7. Setup Nginx
```bash
# Create Nginx config
nano /etc/nginx/sites-available/lemmi-run
```

Copy konfigurasi dari `deploy-vps.sh` atau buat sederhana:
```nginx
server {
    listen 80;
    server_name lemmi-run.hetgr.cloud 145.79.15.245;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/lemmi-run /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

## 🔗 Access URLs

Setelah deployment berhasil:
- **Primary**: http://lemmi-run.hetgr.cloud
- **Direct IP**: http://145.79.15.245
- **With Port**: http://145.79.15.245:3000

## 📊 Management Commands

```bash
# SSH ke server
ssh root@145.79.15.245

# Check aplikasi status
pm2 status

# View logs
pm2 logs lemmi-run

# Restart aplikasi
pm2 restart lemmi-run

# Monitor aplikasi
pm2 monit

# Check Nginx status
systemctl status nginx

# View system resources
htop
```

## 🔧 Troubleshooting

### Jika aplikasi tidak jalan:
```bash
# Check logs
pm2 logs lemmi-run --lines 50

# Check port usage
netstat -tlnp | grep :3000

# Restart services
pm2 restart lemmi-run
systemctl restart nginx
```

### Jika domain tidak bisa diakses:
```bash
# Check DNS
nslookup lemmi-run.hetgr.cloud

# Check Nginx config
nginx -t

# Check firewall
ufw status
```

### Jika perlu update aplikasi:
```bash
# Stop aplikasi
pm2 stop lemmi-run

# Upload file baru
rsync -avz --exclude 'node_modules' --exclude '.git' \
    /path/to/lemmi-run/ root@145.79.15.245:/var/www/lemmi-run/

# Build dan restart
cd /var/www/lemmi-run
npm install
npm run build
pm2 restart lemmi-run
```

## ⚡ Performance Tips

1. **Enable Gzip** (sudah ada di script)
2. **Cache static files** (sudah ada di script)
3. **Monitor resources** dengan `htop` atau `pm2 monit`
4. **Log rotation** (sudah disetup di script)

## 🔒 Security

1. **Firewall** sudah disetup untuk port 22, 80, 443, 3000
2. **Nginx headers** untuk security sudah ditambahkan
3. **PM2** runs dengan user privileges yang tepat

## 📝 Notes

- Aplikasi akan auto-restart jika crash
- Logs disimpan di `/var/log/pm2/`
- Nginx config di `/etc/nginx/sites-available/lemmi-run`
- App files di `/var/www/lemmi-run`

## 🚀 Ready to Deploy!

Jalankan command berikut untuk start deployment:

```bash
./deploy-vps.sh
```