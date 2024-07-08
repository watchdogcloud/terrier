import { Params, ServiceAddons } from '@feathersjs/feathers';
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication';
import { LocalStrategy } from '@feathersjs/authentication-local';
import { expressOauth } from '@feathersjs/authentication-oauth';

import { Application } from './declarations';
import { BadRequest, NotAuthenticated } from '@feathersjs/errors';
import { verifyOTP } from './utilities/otpless';
// import { verifyOTP } from 'otpless-node-js-auth-sdk';
import bcrypt from 'bcrypt';
declare module './declarations' {
  interface ServiceTypes {
    'authentication': AuthenticationService & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const authentication = new AuthenticationService(app);
  class LocalOTPLessStrategy extends LocalStrategy {

    async comparePassword(user: any, code: string): Promise<any> {

      const authCodeService = app.service('otp');
      const authCode = await authCodeService._find({
        query: {
          type: 'mobile',
          dest: user.phone,
          $sort: {
            createdAt: -1
          },
          $limit: 1
        },
        paginate: false
      });
      // console.log({ authCode });
      if (!authCode[0]) throw new BadRequest('No OTP Requests found,initiate a OTP Request first.');

      if (code === '000000') return user; //default for now in development

      const resp = await verifyOTP(
        user.phone,
        authCode[0].orderId,
        code,
      );

      if (!Object.keys(resp).includes('isOTPVerified')) throw new Error(resp.message);
      if (!resp.isOTPVerified) throw new BadRequest('Invalid OTP');

      await authCodeService._remove(authCode[0]._id);
      return user;
    }
  }

  class ServerOTPLessStrategy extends LocalStrategy {
    async comparePassword(user: any, code: string): Promise<any> {
      // console.log('user:', user);
      return {
        phone: user.phone
      };
    }
  }

  class LocalPhoneStrategy extends LocalStrategy {
    async comparePassword(user: any, password: string): Promise<any> {
      // console.log(user.password, password);
      const result = await bcrypt.compare(password, user.password);
      // console.log(result)
      if (!result) throw new NotAuthenticated();
      return user;
    }
  }

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());
  authentication.register('server-otpless-whatsapp', new ServerOTPLessStrategy());
  authentication.register('local-otpless-whatsapp', new LocalOTPLessStrategy());
  // authentication.register('local-phone', new LocalPhoneStrategy());

  app.use('/authentication', authentication);
  app.configure(expressOauth());
}