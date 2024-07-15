import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { randomBytes } from 'crypto';
import { BadRequest, NotAuthenticated } from '@feathersjs/errors';

interface Data { }
interface CreateDTO {
  metadata: Map<string, string>
  project: string;
}
interface ServiceOptions { }

export class Generate implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(params?: Params): Promise<Data[] | Paginated<Data>> {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get(id: Id, params?: Params): Promise<Data> {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data: CreateDTO, params?: Params): Promise<Data> {
    // if (Array.isArray(data)) {
    //   return Promise.all(data.map(current => this.create(current, params)));
    // }

    if (!params?.user) throw new NotAuthenticated();

    const {
      user
    } = params;

    const {
      project
    } = data;

    if(!project) throw new BadRequest('Project Not provided.');

    const res = await this.app.service('keys')._patch(null, {
      status: 'revoked',
      deleted: true,
      deletedBy: user._id,
      deletedAt: new Date().toLocaleString(),
    }, {
      query: {
        user: params?.user._id,
        project: project,
      }
    });

    const buf = randomBytes(parseInt(this.app.get('keygen').length || '32', 10));
    const key = buf.toString('hex');

    await this.app.service('keys')._create({
      key,
      user: user._id,
      status: 'active',
      totalCalls: 0,
      metadata: data.metadata,
      project: project
    });

    return {
      api_key: key,
      project,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patch(id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove(id: NullableId, params?: Params): Promise<Data> {
    return { id };
  }
}
