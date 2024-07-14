import { EachMessagePayload } from 'kafkajs';
import app from '../app';

const streamLiveMetrics = (payload: EachMessagePayload) => {
  console.log('streamLiveMetrics');
};

export default streamLiveMetrics;