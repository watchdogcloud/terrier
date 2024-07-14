// Initializes the `metrics/cpu` service on path `/metrics/cpu`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Cpu } from './cpu.class';
import createModel from '../../../models/cpu.model';
import hooks from './cpu.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'metrics/cpu': Cpu & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/metrics/cpu', new Cpu(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('metrics/cpu');

  service.hooks(hooks);
}
