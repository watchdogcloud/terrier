/**
 * make sure to register your topics in the config/default.json or production.json as topic creation internally is dependent on it..
 */

enum KafkaTopicEnum {
    SYSTEM_METRICS = 'system.metrics',
    CRITICAL_ALERTS = 'critical.alerts',
    STREAM_DATA_CHAN_1 = 'realtime.stream.1', // future...
}
 
export const KafkaTopicEnumList = [
  KafkaTopicEnum.CRITICAL_ALERTS,
  KafkaTopicEnum.SYSTEM_METRICS,
  KafkaTopicEnum.STREAM_DATA_CHAN_1,
];
 
export default KafkaTopicEnum;