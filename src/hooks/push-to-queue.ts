// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    try {
      const {
        app,
        data,
      } = context;
      const kafka = app.get('kafka');

      const producer = kafka.producer();

      await kafka.admin().createTopics({
        topics: [{
          topic: 'randi',
          numPartitions: 2,
          replicationFactor: 1,
          configEntries: [
            { name: 'retention.ms', value: '604800000' }, // 7 days in ms...
          ],
        }],
      });

      
      await producer.connect();
      await producer.send({
        topic: 'test-topic',
        messages: [
          { value: 'Hello KafkaJS user!' },
        ],
      });

      await producer.disconnect();
      console.log('message sent');

      const consumer = kafka.consumer({ groupId: 'test-group' });

      await consumer.connect();
      await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

      await consumer.run({
        eachMessage: async ({ topic, partition, message }: { topic: any, partition: any, message: any }) => {
          console.log({
            value: message.value.toString(),
          });
        },
      });  
      return context;
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  };
};


// 1 topic - system-metrics
// 2 topic - alerts
// 2 partition - 
// 1 CG 