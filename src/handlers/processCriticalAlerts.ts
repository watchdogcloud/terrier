import { EachMessagePayload } from 'kafkajs';

const processCriticalAlerts = async (payload: EachMessagePayload) => {
  try {
    console.log('criti');
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

export default processCriticalAlerts;