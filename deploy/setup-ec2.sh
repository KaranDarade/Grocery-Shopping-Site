#!/bin/bash
set -euo pipefail

# Update system
sudo apt-get update -y
sudo apt-get upgrade -y

# Install Docker
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Install AWS CLI
sudo apt-get install -y awscli

# Install Nginx
sudo apt-get install -y nginx

# Create app directory
sudo mkdir -p /opt/grocery
sudo chown ubuntu:ubuntu /opt/grocery

# Create .env file (user must populate this)
if [ ! -f /opt/grocery/.env ]; then
  cat > /opt/grocery/.env << 'ENVEOF'
DATABASE_URL=postgresql://grocery:grocery@localhost:5432/grocery
JWT_SECRET=change-this-secret
JWT_REFRESH_SECRET=change-this-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://grocery.in
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
GOOGLE_CLIENT_ID=
ENVEOF
fi

# Install Nginx config
sudo cp /opt/grocery/nginx.conf /etc/nginx/sites-available/api.grocery.in
sudo ln -sf /etc/nginx/sites-available/api.grocery.in /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# Set up Docker login for ECR
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.ap-south-1.amazonaws.com

# Pull and run backend
docker pull $(aws sts get-caller-identity --query Account --output text).dkr.ecr.ap-south-1.amazonaws.com/grocery-backend:latest
docker stop grocery-backend || true
docker rm grocery-backend || true
docker run -d \
  --name grocery-backend \
  --restart unless-stopped \
  -p 5000:5000 \
  --env-file /opt/grocery/.env \
  $(aws sts get-caller-identity --query Account --output text).dkr.ecr.ap-south-1.amazonaws.com/grocery-backend:latest

# Set up SSL with Let's Encrypt
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.grocery.in --non-interactive --agree-tos -m admin@grocery.in

# Set up auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

echo "Deployment complete!"
