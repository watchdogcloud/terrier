import { EachMessagePayload } from 'kafkajs';
import app from '../app';
import Mailer from '../utilities/mailing';
import templGenerator from '../templ-generator';
import LocaleEnum from '../constants/locales-support';

const processMails = async (payload: EachMessagePayload) => {

  try {
    console.log('insertIntoPayload');

    if (!payload.message.value) {
      throw new Error('Message value is missing');
    }

    const messageString = payload.message.value.toString();
    const message = JSON.parse(messageString);
    
    const {
      cumulativeOrSpikeVal,
      threshold,
      component,
      incidentTime,
      alertType
    } = message;

    //pull from db..
    const recipients :string[] = [''];
    
    // send mail; 
    const mailer = new Mailer();
    const lang = LocaleEnum.EN;

    const alertTemplate = templGenerator.alerts[lang !== LocaleEnum.EN ? lang : LocaleEnum.EN]
      .render({
        cumulativeOrSpikeVal,
        threshold,
        component,
        incidentTime,
        alertType
      });
   
    await mailer.sendMail(recipients,subjectBuilder(alertType),alertTemplate);
  } catch (error) {
    console.error('Error during consumer setup:', error);
    throw new Error('Consumer setup failed');
  }
};

export default processMails;


const subjectBuilder = <T extends string = string>(alertType: T) : string => {
  switch (alertType) {
  case 'CPU':
    return 'CPU Alert: Threshold Exceeded';
  case 'MEMORY':
    return 'Memory Alert: Threshold Exceeded';
  case 'DISK':
    return 'Disk Alert: Threshold Exceeded';
  default:
    return 'Alert: Threshold Exceeded';
  }
};

/**
    const data = {
      cumulativeOrSpikeVal,
      threshold,
      component,
      incidentTime,
      alertType
    };
 */
