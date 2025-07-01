#!/bin/sh

# Wait for Kafka to be ready
sleep 10

# Create topics
kafka-topics --bootstrap-server localhost:9092 --create --if-not-exists --topic user-notifications --partitions 1 --replication-factor 1

# Add more topic creation commands as needed
