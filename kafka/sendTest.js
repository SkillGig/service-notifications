// sendTest.js
import { Kafka } from "kafkajs";

const kafka = new Kafka({ brokers: ["localhost:9092"] });
const producer = kafka.producer();

const run = async () => {
  await producer.connect();

  await producer.send({
    topic: "user-notifications",
    messages: [
      {
        key: "user-123",
        value: JSON.stringify({
          userId: "user-123",
          title: "🎉 You unlocked a badge!",
          body: "Keep learning, hero!",
          type: "badge",
          actionUrl: "/achievements",
        }),
      },
    ],
  });

  console.log("✅ Notification sent via Kafka");
  await producer.disconnect();
};

run().catch(console.error);
