// metrics/mem-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose } from 'mongoose';

export default function (app: Application): Model<any> {
  const modelName = 'mem';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    total: {
      type: Number,
    },
    available: {
      type: Number,
    },
    used: {
      type: Number,
    },
    usedPercent: {
      type: Number,
    },
    free: {
      type: Number,
    },
    active: {
      type: Number,
    },
    inactive: {
      type: Number,
    },
    wired: {
      type: Number,
    },
    laundry: {
      type: Number,
    },
    buffers: {
      type: Number,
    },
    cached: {
      type: Number,
    },
    writeback: {
      type: Number,
    },
    dirty: {
      type: Number,
    },
    writebacktmp: {
      type: Number,
    },
    shared: {
      type: Number,
    },
    slab: {
      type: Number,
    },
    sreclaimable: {
      type: Number,
    },
    sunreclaim: {
      type: Number,
    },
    pagetables: {
      type: Number,
    },
    swapcached: {
      type: Number,
    },
    commitlimit: {
      type: Number,
    },
    committedas: {
      type: Number,
    },
    hightotal: {
      type: Number,
    },
    highfree: {
      type: Number,
    },
    lowtotal: {
      type: Number,
    },
    lowfree: {
      type: Number,
    },
    swaptotal: {
      type: Number,
    },
    swapfree: {
      type: Number,
    },
    mapped: {
      type: Number,
    },
    vmalloctotal: {
      type: Number,
    },
    vmallocused: {
      type: Number,
    },
    vmallocchunk: {
      type: Number,
    },
    hugepagestotal: {
      type: Number,
    },
    hugepagesfree: {
      type: Number,
    },
    hugepagesize: {
      type: Number,
    }
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<any>(modelName, schema);
}
