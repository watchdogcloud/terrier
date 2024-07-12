import { HooksObject } from '@feathersjs/feathers';

import pushToQueue from '../../hooks/push-to-queue';

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [pushToQueue()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
