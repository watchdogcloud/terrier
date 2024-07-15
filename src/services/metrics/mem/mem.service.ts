// Initializes the `metrics/mem` service on path `/metrics/mem`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Mem } from './mem.class';
import createModel from '../../../models/mem.model';
import hooks from './mem.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'metrics/mem': Mem & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi:true,
  };

  // Initialize our service with any options it requires
  app.use('/metrics/mem', new Mem(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('metrics/mem');

  service.hooks(hooks);
}
