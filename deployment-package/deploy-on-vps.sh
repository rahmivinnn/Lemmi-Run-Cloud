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
