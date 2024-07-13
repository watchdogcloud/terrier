import { EachMessagePayload } from 'kafkajs';
import app from '../app';

const insertIntoDatabase = async (payload: EachMessagePayload) => {
  try {
    console.log(payload.message.toString());
    const message = payload.message.toString();
    await app.service('recv-data')._create({
      message,
    });
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

export default insertIntoDatabase;