// Initializes the `kafka-administration` service on path `/kafka-administration`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { KafkaAdministration } from './kafka-administration.class';
import hooks from './kafka-administration.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'kafka-administration': KafkaAdministration & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/kafka-administration', new KafkaAdministration(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('kafka-administration');

  service.hooks(hooks);
}
