import { createClient, RedisClientType } from 'redis';
import { Application } from './declarations';


export default async function(app:Application) {
  const client = await createClient()
    .on('error', err => console.log('Redis Client Error', err))
    .connect();
  console.log('[TERRIER]: redis connected');
  app.set('redis',client);
}