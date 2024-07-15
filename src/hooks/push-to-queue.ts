// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import { produceMessage } from '../kafka';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    try {
      const {
        app,
        data,
        params,
      } = context;
      const producer = app.get('kafkaProducer');

      /**
       * avoid key for allowing round robin
       */
      await produceMessage(producer, [
        {
          value: Buffer.from(JSON.stringify(data)),
        }
      ],
      'system.metrics');
      console.log('params.user', params.user);
      
      context.result = {
        message: 'pushed to queue successfully',
        code: 200,
        ack: 'true',
        data,
        user: params.user
      };

      // context.service.emit('recvecho', {
      //   'bbsr': true
      // })

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