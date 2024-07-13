import { Application } from './declarations';
import { createConsumerOnTopic } from './kafka';

export default async function (app: Application): Promise<void> {
  console.log('hiii!!');
  const consumerList = [
    {
      cg: 'metrics.cg',
      topics: ['metrics'],
      numOfConsumers: 3
    },
    {
      cg: 'alerts.cg',
      topics: ['critical.metrics.alert'],
      numOfConsumers: 3
    }
  ];
  // console.log( app.get('consumerConfs'))
  // const createConsumerOnTopic = app.get('consumerConfs').createConsumerOnTopic;
  // console.log('running consumer configs...YAY')
  for (let i = 0; i < consumerList.length; ++i) {
    const config = consumerList[i];
    const consumers = await createConsumerOnTopic(app, config.cg, config.topics);
    console.log(`Created consumers for group: ${config.cg}`);
  }
};  