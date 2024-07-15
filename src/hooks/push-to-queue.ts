// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import { produceMessage } from '../kafka';
import { BadRequest } from '@feathersjs/errors';

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
      const apiKey = context.params.headers?.['api-key'];

      const [keyOwner] = await app.service('keys')._find({
        query: {
          key: apiKey,
          status: 'active',
        },
        paginate: false,
      });

      if (!keyOwner) throw new BadRequest('Invalid API Key');

      data['keyOwner'] = keyOwner;

      await produceMessage(producer, [
        {
          value: Buffer.from(JSON.stringify(data)),
        }
      ],
      'system.metrics');

      await app.service('keys')._patch(keyOwner._id, {
        $inc: { totalCalls: 1 }
      });

      context.result = {
        message: 'pushed to queue successfully',
        code: 200,
        ack: 'true',
        data,
        user: keyOwner.user
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