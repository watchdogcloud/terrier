import { Admin, CompressionTypes, Consumer, ConsumerConfig, EachMessagePayload, ITopicMetadata, Kafka, Message, PartitionAssigners, Producer, logLevel } from 'kafkajs';
import { Application } from './declarations';

export default function (app: Application): void {

  const kafka = new Kafka({
    clientId: 'terrier',
    brokers: app.get('kafkaConf').bootstrap_servers,
    logLevel: logLevel.ERROR
  });
  app.set('kafka', kafka);
}


export const createConsumerOnTopic = async (app: Application, groupId: string, topics: string[]): Promise<Consumer[]> => {
  const consumers: Consumer[] = [];
  console.log({ createConsumerOnTopic: 'called' });
  try {
    const kafka = app.get('kafka');

    for (let i = 0; i < topics.length; ++i) {
      const topic = topics[i];
      console.log({ topic });
      const consumer: Consumer = kafka.consumer({
        groupId: groupId,
        // partitionAssigners: [PartitionAssigners.roundRobin],
        sessionTimeout: 30000,
        rebalanceTimeout: 60000,
        heartbeatInterval: 3000,
        metadataMaxAge: 300000,
        allowAutoTopicCreation: true,
        maxBytesPerPartition: 1048576,
        minBytes: 1,
        maxBytes: 10485760,
        maxWaitTimeInMs: 5000,
        retry: { retries: 5 },
        readUncommitted: false,
        maxInFlightRequests: null,
      });

      await consumer.connect();
      console.log('consumer is connected');
      await consumer.subscribe({ topics: [topic] ,fromBeginning:true});
      console.log('consumer subscribed!');
      await consumer.run({
        eachMessage: async ({ topic, partition, message, heartbeat, pause }: EachMessagePayload) => {
          console.log({
            key: message?.key?.toString(),
            value: message?.value?.toString(),
            headers: message.headers,
          });
        },
      });
      consumers.push(consumer);
    }

    return consumers;
  } catch (error: any) {
    console.error('Error creating consumers:', error);
    throw new Error(error);
  }
};


const consumeMessage = async (consumer: Consumer) => {
  /**
   * @note Be aware that the eachMessage handler should not block for longer than the configured session timeout or else the consumer will be removed from the group. If your workload involves very slow processing times for individual messages then you should either increase the session timeout or make periodic use of the heartbeat function exposed in the handler payload. The pause function is a convenience for consumer.pause({ topic, partitions: [partition] }). It will pause the current topic-partition and returns a function that allows you to resume consuming later.
   */
  try {
    await consumer.run({
      eachMessage: async ({ topic, partition, message, heartbeat, pause }: EachMessagePayload) => {
        console.log({
          key: message?.key?.toString(),
          value: message?.value?.toString(),
          headers: message.headers,
        });
      },
    });
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

const createProducerOnTopic: any = (app: Application): Producer => {

  try {
    /**
     * {@link https://kafka.js.org/docs/producing#options}
     */
    const kafka = app.get('kafka');
    const producer: Producer = kafka.producer({
      allowAutoTopicCreation: false,
      transactionTimeout: 60000,
      retry: null,
      metadataMaxAge: 300000,
      idempotent: false, // EXPERIMENTAL
      maxInFlightRequests: null
    });
    return producer;
  }
  catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

const produceMessage = async (producer: Producer, kvObject: Array<Message>, topicName: string) => {

  try {
    await producer.connect();
    await producer.send({
      topic: topicName,
      messages: kvObject,
      acks: -1,
      timeout: 30000,
      compression: CompressionTypes.None
    });
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }

};

export const createNewTopicIfDoesNotExist = async (app: Application): Promise<void> => {
  const kafka = app.get('kafka');
  const admin = kafka.admin();

  try {
    await admin.connect();

    const existingTopics: ITopicMetadata[] = await admin.listTopics();
    console.log({existingTopics});
    const desiredTopics = app.get('kafkaConf').topics;

    // Checking if each desired topic exists with the correct partitions
    for (const topic of desiredTopics) {
      const topicExists = existingTopics.some(t => t.name === topic.name);

      if (!topicExists) {
        // Topic does not exist, create it
        await admin.createTopics({
          topics: [{
            topic: topic.name,
            numPartitions: topic.numPartitions || 1,
            replicationFactor: topic.replicationFactor || 1,
          }],
        });

        console.log(`Created topic '${topic.name}' with ${topic.numPartitions || 1} partitions.`);
      } else {
        // Topic exists, check if partitions match
        const topicInfo = existingTopics.find(t => t.name === topic.name);
        const currentPartitions = topicInfo?.partitions.length || 0;
        const desiredPartitions = topic.numPartitions || 1;

        if (currentPartitions !== desiredPartitions) {
          console.log(`Topic '${topic.name}' exists but has ${currentPartitions} partitions. Updating to ${desiredPartitions} partitions.`);
          await admin.createPartitions({
            topicPartitions: [{
              topic: topic.name,
              count: desiredPartitions,
            }],
          });
        }
      }
    }

  } catch (error: any) {
    console.error('Error creating or updating topics:', error);
    throw new Error(error);
  } finally {
    await admin.disconnect();
  }
};

export const createAndSetProducer = async (app: Application) => {
  try {
    const p = createProducerOnTopic(app);
    await p.connect();
    console.log('producer connected');
    await produceMessage(p, [
      {
        key: 'key1', value: 'hello world'
      },
      {
        key: 'key1', value: 'hello bhadwa sala'
      }
    ], 'metrics');
    console.log('producer sent messages');

    app.set('kafkaProducer', p);
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }

};