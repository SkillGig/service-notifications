#!/bin/bash

# Get the EC2 public IP
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

if [ -z "$EC2_IP" ]; then
    echo "Not running on EC2 or couldn't get public IP, using localhost"
    export KAFKA_ADVERTISED_HOST="localhost"
else
    echo "Running on EC2 with public IP: $EC2_IP"
    export KAFKA_ADVERTISED_HOST="$EC2_IP"
fi

# Stop any running containers
docker-compose down

# Start Kafka with the correct advertised listener
KAFKA_ADVERTISED_HOST=$KAFKA_ADVERTISED_HOST docker-compose up -d

# Wait for Kafka to be ready
echo "Waiting for Kafka to be ready..."
sleep 20

# Set the Kafka broker address for the Node.js application
export KAFKA_BROKERS="${KAFKA_ADVERTISED_HOST}:9092"

# Create logs directory if it doesn't exist
mkdir -p ./logs

# Stop any existing PM2 processes for this app
pm2 delete service-notifications 2>/dev/null || true

# Start the application with PM2 in production mode
pm2 start startup.config.cjs --env production

# Save PM2 configuration to survive reboots
pm2 save

echo "Application started with Kafka broker at ${KAFKA_BROKERS}"
