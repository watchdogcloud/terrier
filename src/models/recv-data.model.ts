// recv-data-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose } from 'mongoose';

export default function (app: Application): Model<any> {
  const modelName = 'recvData';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    cpu: {
      type: Schema.Types.ObjectId,
      ref: 'cpu'
    },
    disk: {
      type: Schema.Types.ObjectId,
      ref: 'disk'
    },
    mem: {
      type: Schema.Types.ObjectId,
      ref: 'mem'
    },
    network: [{
      type: Schema.Types.ObjectId,
      ref: 'network'
    }],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'projects'
    },
    callNumber: {
      type: Number
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
