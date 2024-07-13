import { EachMessagePayload } from 'kafkajs';
import app from '../app';

const streamLiveMetrics = (payload:EachMessagePayload) => {
  app.on('connection', (conn: any) => {

  });
};

export default streamLiveMetrics;