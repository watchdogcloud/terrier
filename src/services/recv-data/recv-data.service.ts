// Initializes the `recv-data` service on path `/recv-data`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { RecvData } from './recv-data.class';
import createModel from '../../models/recv-data.model';
import hooks from './recv-data.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'v1/recv-data': RecvData & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    // events:
  };

  // Initialize our service with any options it requires
  app.use('/v1/recv-data', new RecvData(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/recv-data');

  service.hooks(hooks);
}
