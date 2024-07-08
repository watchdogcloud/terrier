// Initializes the `send-otp` service on path `/send-otp`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { SendOtp } from './send-otp.class';
import hooks from './send-otp.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'send-otp': SendOtp & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/send-otp', new SendOtp(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('send-otp');

  service.hooks(hooks);
}
