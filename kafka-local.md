`kafka-storage format -t $(kafka-storage random-uuid) -c /opt/homebrew/etc/kafka/server.properties`

`kafka-server-start /opt/homebrew/etc/kafka/server.properties`

Create a topic
```kafka-topics \
  --create \
  --bootstrap-server localhost:9092 \
  --replication-factor 1 \
  --partitions 1 \
  --topic user-notifications```

Verify
`kafka-topics --list --bootstrap-server localhost:9092`

With Docker
📦 Prerequisites
✅ Docker Desktop installed and running

✅ Internet access to pull Kafka image

Run 
`docker-compose up -d`

`docker ps`

After running these open another terminal and run your application using `yarn start`


Stop and Clean Up

`docker-compose down`

To clear all Kafka data:

```docker-compose down -v```