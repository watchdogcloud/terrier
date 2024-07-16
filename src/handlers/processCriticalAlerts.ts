import { EachMessagePayload } from 'kafkajs';

const processCriticalAlerts = async (payload: EachMessagePayload) => {
  try {
    console.log('processCriticalAlerts');
    
    if (!payload.message.value) {
      throw new Error('Message value is missing');
    }
    
    const messageString = payload.message.value.toString();
    const message = JSON.parse(messageString);
    const { cpu, disk, mem, network, keyOwner } = message;

    const spikeThreshold = { cpu: 70, mem: 80, disk: 90 }; // Example thresholds
    const cumulativeThreshold = { cpu: 60, mem: 70, disk: 80 }; // Example thresholds

  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

export default processCriticalAlerts;

const calculateCumulativeAverages = () => {
  const totalCpu = 0, totalMem = 0, totalDisk = 0;
  const count = 0;


  // metrics.forEach(entry => {
  //   totalCpu += entry.cpu.reduce((acc: number, value: number) => acc + value, 0) / entry.cpu.length;
  //   totalMem += entry.mem.usedPercent;
  //   totalDisk += entry.disk.usedPercent;
  //   count++;
  // });

  return { cpu: totalCpu / count, mem: totalMem / count, disk: totalDisk / count };
};