// Initializes the `version` service on path `/version`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Version } from './version.class';
import hooks from './version.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'version': Version & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/version', new Version(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('version');

  service.hooks(hooks);
}
