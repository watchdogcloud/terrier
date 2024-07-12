import { Kafka } from 'kafkajs';
import { Application } from './declarations';

export default function (app: Application): void {
  const kafka = new Kafka({
    clientId: 'terrier',
    brokers: ['localhost:9092'],
  });

  app.set('kafka', kafka);
}
