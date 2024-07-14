// Initializes the `metrics/disk` service on path `/metrics/disk`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Disk } from './disk.class';
import createModel from '../../../models/disk.model';
import hooks from './disk.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'metrics/disk': Disk & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi:true,
  };

  // Initialize our service with any options it requires
  app.use('/metrics/disk', new Disk(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('metrics/disk');

  service.hooks(hooks);
}
