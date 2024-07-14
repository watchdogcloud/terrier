import { Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { BadRequest } from '@feathersjs/errors';
import { resendOTP, sendOTP } from '../../utilities/otpless';
interface Data {
  email: string;
  phone: string;
}

interface ServiceOptions { }

function generateOrderId() {
  const digits = '0123456789';
  let orderId = 'oid_';

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    orderId += digits[randomIndex];
  }

  return orderId;
}

export class SendOtp implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data: Data, params?: Params): Promise<{ message: string, isNewUser: boolean }> {

    const { clientId, clientSecret, otpLength, expiry, hash } = this.app.get('otpless'),
      CHANNEL = 'WHATSAPP',
      otpService = this.app.service('otp'),
      orderId = generateOrderId();

    if (!data.phone) throw new BadRequest('Phone Number not provided');

    let resp;
    try {
      if (params?.query?.['resend']) {
        //resend req
        const authCode = await otpService._find({
          query: {
            type: 'mobile',
            dest: data.phone,
            $sort: { createdAt: -1 },
            $limit: 1,
          },
          paginate: false,
        });

        if (!authCode[0])
          throw new BadRequest('No previous OTP request found for this phone number.');

        resp = await resendOTP(
          authCode[0].orderId
        );
      } else {
        // first req
        resp = await sendOTP(
          data.phone,
          null,
          CHANNEL,
          hash,
          orderId,
          expiry,
          otpLength,
        );

        otpService._create({
          type: 'mobile',
          dest: data.phone,
          orderId: orderId
        });
        console.log({ orderId });
      }

      if (resp.message) {
        throw new Error(resp.message);
      }

      const [user] = await this.app.service('users')._find({
        query: {
          phone: data.phone,
        },
        paginate: false
      });

      return {
        message: 'OTP sent successfully',
        isNewUser: !Boolean(user),
      };
    } catch (error: any) {
      throw new Error(`Failed to send OTP: ${error.message}`);
    }
  }
}