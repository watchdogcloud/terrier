import { Consumer } from 'kafkajs';
import { Application } from './declarations';
import { createConsumerOnTopic } from './kafka';
import fs from 'node:fs';
import processMetrics from './processors/processMetrics';
import insertIntoDatabase from './processors/insertIntoDatabase';
import processMails from './processors/processMails';
import KafkaTopicEnum from './constants/kafka-topics.enum';
// import streamLiveMetrics from './handlers/streamLiveMetrics';

export default async function setupConsumers(app: Application): Promise<void> {
  console.log('Starting consumer setup...');
  try {
    const consumerList = [
      {
        groupId: 'system.metrics.processor',
        topics: [KafkaTopicEnum.SYSTEM_METRICS],
        numOfConsumers: 3,
        taskHandler: processMetrics,
      },
      {
        groupId: 'critical.alerts.handler',
        topics: [KafkaTopicEnum.CRITICAL_ALERTS],
        numOfConsumers: 3,
        taskHandler: processMails,
      },
      {
        groupId: 'database.inserter',
        topics: [KafkaTopicEnum.SYSTEM_METRICS],
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
    fs.writeFileSync('./documents/deleteme.json', JSON.stringify(CONSUMER_POOL));
  } catch (error) {
    console.error('Error during consumer setup:', error);
    throw new Error('Consumer setup failed');
  }
}