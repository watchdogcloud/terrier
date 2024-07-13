import { Application } from './declarations';

export default async function (app: Application): Promise<void> {

  const createConsumerOnTopic = app.get('consumerConfs').createConsumerOnTopic;

};  