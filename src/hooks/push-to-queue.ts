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