import { Consumer } from 'kafkajs';
import { Application } from './declarations';
import { createConsumerOnTopic } from './kafka';
import fs from 'node:fs';
import processCriticalAlerts from './handlers/processCriticalAlerts';
import insertIntoDatabase from './handlers/insertIntoDatabase';
import streamLiveMetrics from './handlers/streamLiveMetrics';


export default async function setupConsumers(app: Application): Promise<void> {
  console.log('Starting consumer setup...');
  try {

    const consumerList = [
      {
        groupId: 'system.metrics.processor',
        topics: ['system.metrics'],
        numOfConsumers: 3,
        taskHandler: streamLiveMetrics,
      },
      {
        groupId: 'critical.alerts.handler',
        topics: ['system.alerts.critical'],
        numOfConsumers: 3,
        taskHandler: processCriticalAlerts,
      },
      {
        groupId: 'database.inserter',
        topics: ['system.metrics'],
        numOfConsumers: 3,
        taskHandler: insertIntoDatabase,
      },
    ];

    const CONSUMER_POOL: Consumer[][] = [];
    // Creating consumers in parallel...
    const consumerCreationPromises = consumerList.flatMap(config =>
      Array.from({ length: config.numOfConsumers }).map(() =>
        createConsumerOnTopic(app, config.groupId, config.topics, config.taskHandler)
      )
    );

    const createdConsumers = await Promise.all(consumerCreationPromises);

    createdConsumers.forEach((consumer) => CONSUMER_POOL.push(consumer));

    console.log(`Consumer setup completed. Total consumers created: ${CONSUMER_POOL.length}`);
    console.log({ CONSUMER_POOL });
    fs.writeFileSync('deleteme.json', JSON.stringify(CONSUMER_POOL));
  } catch (error) {
    console.error('Error during consumer setup:', error);
    throw new Error('Consumer setup failed');
  }
}