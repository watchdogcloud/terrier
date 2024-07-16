import { EachMessagePayload } from 'kafkajs';
import app from '../app';
import { RedisClientType } from 'redis';
import fs from 'node:fs';
import { produceMessage } from '../kafka';

const processMetrics = async (payload: EachMessagePayload) => {
  try {
    console.log('processMetrics');

    if (!payload.message.value) {
      throw new Error('Message value is missing');
    }

    const messageString = payload.message.value.toString();
    const message = JSON.parse(messageString);

    const { cpu, disk, mem, network, keyOwner } = message;

    const cpuAvg = calculateAllCoreAvg(cpu);

    const spikeThreshold = { cpu: 70, mem: 80, disk: 90 };

    const alerts = checkAllSpikes({ cpuAvg, memUsedPercent: mem.usedPercent, diskUsedPercent: disk.usedPercent }, spikeThreshold);
    console.log(alerts);

    await checkCummulative(keyOwner.user, keyOwner.project, { cpu: cpuAvg, disk: disk.usedPercent, mem: mem.usedPercent });

    fs.writeFileSync('alert.json', JSON.stringify(alerts));
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

const calculateAllCoreAvg = <T extends number = number>(cpu: T[]) => {
  const totalCpuCoreVal = cpu.reduce((acc, eachCoreVal) => acc + eachCoreVal, 0);
  return totalCpuCoreVal / cpu.length;
};

const checkAllSpikes = (
  metrics: { cpuAvg: number; memUsedPercent: number; diskUsedPercent: number },
  thresholds: { cpu: number; mem: number; disk: number }
) => {
  const { cpuAvg, memUsedPercent, diskUsedPercent } = metrics;
  const { cpu, mem, disk } = thresholds;

  const cpuAlert = checkSpike(cpuAvg, cpu, 'cpu');
  const memAlert = checkSpike(memUsedPercent, mem, 'mem');
  const diskAlert = checkSpike(diskUsedPercent, disk, 'disk');

  return { cpu: cpuAlert, mem: memAlert, disk: diskAlert };
};

const checkSpike = (value: number, threshold: number, metricType: string) => {
  const isSpiked = value > threshold;

  if (isSpiked) {
    pushToAlertTopicIfSIG(value, threshold, metricType, new Date(),'Spike');
  }

  return {
    spiked: isSpiked,
    averagingAt: value,
    thresholdSet: threshold,
    time: new Date().toISOString(),
  };
};

const pushToAlertTopicIfSIG = async (cumulativeOrSpikeVal: number, threshold: number, component: string, incidentTime: Date,alertType: string) => {
  // Implementation for pushing to alert topic
  const producer = app.get('kafkaProducer');
  
  const data = {
    cumulativeOrSpikeVal,
    threshold,
    component,
    incidentTime,
    alertType
  };

  // push to queue for mailing 
  await produceMessage(producer, [
    {
      value: Buffer.from(JSON.stringify(data)),
    }
  ],
  'critical.alerts');

  console.log(`ALERT: ${component} exceeded threshold! Value: ${cumulativeOrSpikeVal}, Threshold: ${threshold}, Time: ${incidentTime}`);
};

const checkCummulative = async (user: string, project: string, metrics: { cpu: number; disk: number; mem: number }) => {
  const redis: RedisClientType = await app.get('redis');

  const userProject = `${user}:${project}`;

  const cumulativeThreshold = { cpu: 60, mem: 70, disk: 80 };

  const aggregatedValues = await redis.hGetAll(userProject);

  if (Object.keys(aggregatedValues).length === 0) {
    // If no value, just push the current value in redis
    await redis.hSet(userProject, {
      cpu: metrics.cpu.toString(),
      disk: metrics.disk.toString(),
      mem: metrics.mem.toString(),
      count: '1',
      lastProcessedAt: new Date().toISOString()
    });
    return;
  }

  const lastProcessedAt = new Date(aggregatedValues.lastProcessedAt);

  const fiveMinutesAgo = new Date();
  fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

  if (lastProcessedAt < fiveMinutesAgo) {
    // 5 minutes elapsed, process the batch
    const count = Number(aggregatedValues.count);
    const cpuAvg = Number(aggregatedValues.cpu) / count;
    const diskAvg = Number(aggregatedValues.disk) / count;
    const memAvg = Number(aggregatedValues.mem) / count;

    await pushToQueueIfCritical(cpuAvg, diskAvg, memAvg, cumulativeThreshold);

    // Reset for next batch window..
    await redis.hSet(userProject, {
      cpu: metrics.cpu.toString(),
      disk: metrics.disk.toString(),
      mem: metrics.mem.toString(),
      count: '1',
      lastProcessedAt: new Date().toISOString()
    });
  } else {
    // T < 5 minutes, just updatez the redis values
    await redis.hSet(userProject, {
      cpu: (Number(aggregatedValues.cpu) + metrics.cpu).toString(),
      disk: (Number(aggregatedValues.disk) + metrics.disk).toString(),
      mem: (Number(aggregatedValues.mem) + metrics.mem).toString(),
      count: (Number(aggregatedValues.count) + 1).toString()
    });
  }
};

const pushToQueueIfCritical = async (
  cpuAvg: number,
  diskAvg: number,
  memAvg: number,
  thresholds: { cpu: number; mem: number; disk: number }
) => {
  const { cpu, mem, disk } = thresholds;

  if (cpuAvg > cpu) {
    await pushToAlertTopicIfSIG(cpuAvg, cpu, 'CPU', new Date(),'Cumulative');
  }

  if (diskAvg > disk) {
    await pushToAlertTopicIfSIG(diskAvg, disk, 'DISK', new Date(),'Cumulative');
  }

  if (memAvg > mem) {
    await pushToAlertTopicIfSIG(memAvg, mem, 'MEMORY', new Date(),'Cumulative');
  }
};

export default processMetrics;
