// users-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose } from 'mongoose';
import RolesEnum, { RolesEnumList } from '../constants/roles.enum';

export default function (app: Application): Model<any> {
  const modelName = 'users';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const schema = new mongooseClient.Schema({
    avatar: {
      type: String,
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      required: true
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    type: {
      type: Number,
      enum: RolesEnumList,
      default: RolesEnum.USER,
      index: true,
    },
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