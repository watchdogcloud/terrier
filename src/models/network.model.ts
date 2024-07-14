// metrics/network-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose } from 'mongoose';

export default function (app: Application): Model<any> {
  const modelName = 'network';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    name: {
      type: String,
    },
    bytesSent: {
      type: Number,
    },
    bytesRecv: {
      type: Number,
    },
    packetsSent: {
      type: Number,
    },
    packetsRecv: {
      type: Number,
    },
    errin: {
      type: Number,
    },
    errout: {
      type: Number,
    },
    dropin: {
      type: Number,
    },
    dropout: {
      type: Number,
    },
    fifoin: {
      type: Number,
    },
    fifoout: {
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
