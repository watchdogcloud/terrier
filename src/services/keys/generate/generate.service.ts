// Initializes the `keys/generate` service on path `/keys/generate`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Generate } from './generate.class';
import hooks from './generate.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'keys/generate': Generate & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/keys/generate', new Generate(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('keys/generate');

  service.hooks(hooks);
}
