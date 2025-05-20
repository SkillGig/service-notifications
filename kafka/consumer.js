import { kafka } from './kafkaClient.js';
import { handleNotificationEvent } from '../handlers/notification.handler.js';
import logger from '../config/logger.js';

const consumer = kafka.consumer({ groupId: 'notification-consumer' });

export const startKafkaConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'user-notifications', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      const payload = JSON.parse(value);
      logger.debug('Kafka Message Received:', topic, partition, message, payload);

      await handleNotificationEvent(payload);
    },
  });
};
