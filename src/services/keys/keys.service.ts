// Initializes the `keys` service on path `/keys`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Keys } from './keys.class';
import createModel from '../../models/keys.model';
import hooks from './keys.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'keys': Keys & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/keys', new Keys(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('keys');

  service.hooks(hooks);
}
