import { Application } from './declarations';

export default function (app: Application): void {
    
  const createConsumerOnTopic = app.get('consumerConfs').createConsumerOnTopic;
  const groupId = 'critical.alert.group';
  const topics = ['metrics'];
    
};