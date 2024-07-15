import { EachMessagePayload } from 'kafkajs';
import app from '../app';
import fs from 'node:fs';
const insertIntoDatabase = async (payload: EachMessagePayload) => {
  try {
    console.log('insertIntoPayload');

    if (!payload.message.value) {
      throw new Error('Message value is missing');
    }

    const messageString = payload.message.value.toString();
    const message = JSON.parse(messageString);
    const { cpu, disk, mem, network, keyOwner } = message;

    const [cpuRes, diskRes, memRes, networkRes] = await Promise.all([
      app.service('metrics/cpu')._create({ cpu }),
      app.service('metrics/disk')._create({ ...disk }),
      app.service('metrics/mem')._create({ ...mem }),
      app.service('metrics/network')._create(network),
    ]);

    const ids = {
      cpu: cpuRes._id,
      disk: diskRes._id,
      mem: memRes._id,
      network: Array.isArray(networkRes) ? networkRes.map((net: any) => net._id) : networkRes._id,
    };

    fs.writeFileSync('met.json', JSON.stringify(ids));

    await app.service('recv-data')._create(ids);

    console.log('queue se nikalke keyOwner = ', keyOwner);
  } catch (error: any) {
    console.error('Error inserting into database:', error.message, error.stack);
    throw new Error(error);
  }
};

export default insertIntoDatabase;
