import { Kafka } from "kafkajs";
import logger from "../config/logger.js";

export const kafka = new Kafka({
  clientId: "notification-service",
  brokers: ["localhost:9092"],
});

export const producer = kafka.producer();

export const initializeKafka = async () => {
  await producer.connect();
  logger.debug("✅ Kafka producer connected");
};

await initializeKafka();
