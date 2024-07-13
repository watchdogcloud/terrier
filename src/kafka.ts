import { CompressionTypes, Consumer, ConsumerConfig, EachMessagePayload, Kafka, Message, PartitionAssigners, Producer } from 'kafkajs';
import { Application } from './declarations';

export default function (app: Application): void {

  const kafka = new Kafka({
    clientId: 'terrier',
    brokers: app.get('kafka').bootstrap_servers,
  });

  app.set('kafka', kafka);

  app.set('consumerConfs', {
    createConsumerOnTopic,
    consumeMessage
  });

  app.set('producerConfs', {
    createProducerOnTopic,
    produceMessage
  });
}

export const createConsumerOnTopic = async (app: Application, groupId: string): Promise<Consumer> => {
  try {
    const consumer: Consumer = app.get('kafka').consumer({
      groupId: groupId,
      partitionAssigners: [PartitionAssigners.roundRobin],
      sessionTimeout: 30000,
      rebalanceTimeout: 60000,
      heartbeatInterval: 3000,
      metadataMaxAge: 300000,
      allowAutoTopicCreation: true,
      maxBytesPerPartition: 1048576,//1MB
      minBytes: 1,
      maxBytes: 10485760,
      maxWaitTimeInMs: 5000,
      retry: {
        retries: 5
      },
      readUncommitted: false,
      maxInFlightRequests: null,
      /**
       * {@link https://www.confluent.io/blog/multi-region-data-replication/}
       */
      rackId: null
    });

    await consumer.connect();
    await consumer.subscribe({ topics: ['topic-B', 'topic-C'] });
    return consumer;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

const consumeMessage = async (consumer: Consumer) => {
  /**
   * @note Be aware that the eachMessage handler should not block for longer than the configured session timeout or else the consumer will be removed from the group. If your workload involves very slow processing times for individual messages then you should either increase the session timeout or make periodic use of the heartbeat function exposed in the handler payload. The pause function is a convenience for consumer.pause({ topic, partitions: [partition] }). It will pause the current topic-partition and returns a function that allows you to resume consuming later.
   */
  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }: EachMessagePayload) => {
      console.log({
        key: message?.key?.toString(),
        value: message?.value?.toString(),
        headers: message.headers,
      });
    },
  });
};

const createProducerOnTopic = async (app: Application): Promise<Producer> => {

  /**
   * {@link https://kafka.js.org/docs/producing#options}
   */
  const producer: Producer = app.get('kafka').producer({
    allowAutoTopicCreation: false,
    transactionTimeout: 60000,
    createPartitioner: null,
    retry: null,
    metadataMaxAge: 300000,
    idempotent: false, // EXPERIMENTAL
    maxInFlightRequests: null
  });

  return producer;
};

const produceMessage = async (producer: Producer, kvObject: Array<Message>, topicName: string) => {

  await producer.connect();
  await producer.send({
    topic: topicName,
    messages: kvObject,
    acks: -1,
    timeout: 30000,
    compression: CompressionTypes.None
  });
};