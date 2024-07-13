import { Consumer } from 'kafkajs';
import { Application } from './declarations';
import { createConsumerOnTopic } from './kafka';
import fs from 'node:fs';
export default async function setupConsumers(app: Application): Promise<void> {
  console.log('Starting consumer setup...');
  try {

    const consumerList = [
      {
        cg: 'metrics.cg',
        topics: ['metrics'],
        numOfConsumers: 3,
      },
      {
        cg: 'alerts.cg',
        topics: ['critical.metrics.alert'],
        numOfConsumers: 3,
      },
    ];

    const CONSUMER_POOL: Consumer[][] = [];
    // Creating consumers in parallel...
    const consumerCreationPromises = consumerList.flatMap(config =>
      Array.from({ length: config.numOfConsumers }).map(() =>
        createConsumerOnTopic(app, config.cg, config.topics)
      )
    );

    const createdConsumers = await Promise.all(consumerCreationPromises);

    createdConsumers.forEach((consumer) => CONSUMER_POOL.push(consumer));

    console.log(`Consumer setup completed. Total consumers created: ${CONSUMER_POOL.length}`);
    console.log({CONSUMER_POOL});
    fs.writeFileSync('deleteme.json',JSON.stringify(CONSUMER_POOL));
  } catch (error) {
    console.error('Error during consumer setup:', error);
    throw new Error('Consumer setup failed');
  }
}