import { EachMessagePayload } from 'kafkajs';
import app from '../app';
import Mailer from '../utilities/mailing';

const processMails = (payload: EachMessagePayload) => {

  try {
    console.log('insertIntoPayload');

    if (!payload.message.value) {
      throw new Error('Message value is missing');
    }

    const messageString = payload.message.value.toString();
    const message = JSON.parse(messageString);

    // send mail; 
    const mailer = new Mailer();

  } catch (error) {
    console.error('Error during consumer setup:', error);
    throw new Error('Consumer setup failed');
  }
};

export default processMails;