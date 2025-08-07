#!/bin/bash

# Lemmi Run Deployment Script for VPS
# Usage: ./deploy.sh

set -e

echo "🏃 Starting Lemmi Run deployment..."

# Configuration
VPS_IP="145.79.15.245"
VPS_USER="root"
PROJECT_NAME="lemmirun"
DEPLOY_PATH="/opt/lemmirun"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if SSH key exists
if [ ! -f ~/.ssh/id_rsa ]; then
    print_warning "SSH key not found. Generating new SSH key..."
    ssh-keygen -t rsa -b 4096 -C "lemmirun-deploy" -f ~/.ssh/id_rsa -N ""
fi

# Upload files to VPS
print_status "Uploading files to VPS..."
rsync -avz --exclude='node_modules' --exclude='.git' --exclude='dist' \
    ./ ${VPS_USER}@${VPS_IP}:${DEPLOY_PATH}/

# Execute deployment on VPS
print_status "Executing deployment on VPS..."
ssh ${VPS_USER}@${VPS_IP} << EOF
set -e

cd ${DEPLOY_PATH}

# Update system
print_status "Updating system packages..."
apt-get update && apt-get upgrade -y

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    print_status "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null; then
    print_status "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Create logs directory
mkdir -p logs

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down --remove-orphans || true

# Build and start new containers
print_status "Building and starting containers..."
docker-compose up -d --build

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 30

# Check container status
docker-compose ps

# Show logs
print_status "Application logs:"
docker-compose logs --tail=50 lemmirun

print_status "Deployment completed successfully!"
print_status "Application is available at: http://${VPS_IP}"
EOF

print_status "Deployment script completed!"
print_status "Your Lemmi Run application should be accessible at: http://${VPS_IP}"
print_warning "Don't forget to:"
print_warning "1. Configure your domain DNS if you have one"
print_warning "2. Set up SSL certificate for HTTPS"
print_warning "3. Configure firewall rules if needed"