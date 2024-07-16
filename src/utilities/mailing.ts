import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import app from '../app';
/**
 *  maybe we can add DKIM support to prevent mails going to spam ?
 *  @ref {https://github.com/feathersjs-ecosystem/feathers-mailer/pull/35}
*/

export default class Mailer {

  #_smtpConf: {
    email: string,
    password: string;
    host: string;
    port: number;
    secure: true | false;
  };
  
  #_transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.#_smtpConf = app.get('smtp');
    this.#_transporter = nodemailer.createTransport({
      host: this.#_smtpConf.host,
      port: this.#_smtpConf.port,
      secure: this.#_smtpConf.secure,
      auth: {
        user: this.#_smtpConf.email,
        pass: this.#_smtpConf.password,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  public async sendMail(recipients: string[], subject: string, templ: string, plaintext?: string): Promise<void> {
    try {
      const promises = recipients.map(async (recipient) => {
        const info = await this.#_transporter.sendMail({
          from: '"WatchdogCloud" <watchdogcloud.en@gmail.com>',
          to: recipient,
          subject: subject,
          html: templ,
          text: plaintext ? plaintext : '',
        });
        console.log(`Message sent to ${recipient}: ${info.messageId}`);
        return info;
      });

      await Promise.all(promises);
      console.log('All messages sent successfully!');
    } catch (error: any) {
      console.error('Error sending emails:', error);
      throw new Error(error.message);
    }
  }
};