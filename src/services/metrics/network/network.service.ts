// Initializes the `metrics/network` service on path `/metrics/network`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Network } from './network.class';
import createModel from '../../../models/network.model';
import hooks from './network.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'metrics/network': Network & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi:true,
  };

  // Initialize our service with any options it requires
  app.use('/metrics/network', new Network(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('metrics/network');

  service.hooks(hooks);
}
