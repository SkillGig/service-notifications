#!/bin/bash

# This script orchestrates the startup of the service-notifications application.
# It ensures that dependent services (like Kafka) are running via Docker Compose
# before starting the Node.js application with PM2.

echo "--- Starting dependent services (Kafka) with Docker Compose ---"
docker-compose up -d

# Check if docker-compose command was successful
if [ $? -ne 0 ]; then
  echo "Error: docker-compose failed to start. Aborting."
  exit 1
fi

echo ""
echo "--- Starting application with PM2 ---"
pm2 start startup.config.cjs --env production

echo ""
echo "--- Application startup process initiated ---"
echo "--- Use 'pm2 logs' to monitor application logs ---"
echo "--- Use 'pm2 monit' for a real-time dashboard ---"
