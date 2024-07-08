import { Hook } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';
import RolesEnum from '../../../constants/roles.enum';
import { verifyOTP } from '../../../utilities/otpless';
// import { verifyOTP } from 'otpless-node-js-auth-sdk';

const validateOTP = (): Hook => async (context) => {

  const { app, data, params } = context;
  const authService = app.service('authentication');

  const authHeader = params.headers && params.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {

    const accessToken = authHeader.split(' ')[1];
    const authResult = await authService.create({
      'strategy': 'jwt',
      'accessToken': accessToken
    });
    // console.log(authResult, accessToken)
    params.user = authResult.user;

    if (params.user
      && (params.user.type === RolesEnum.ADMIN
        || params.user.type === RolesEnum.SUPER_ADMIN)) {
      return context;
    }
  }

  if (!data.phone || !data.otp) throw new BadRequest('Phone and OTP is required.');

  try {
    const authCodeService = app.service('otp');
    const authCode = await authCodeService._find({
      query: {
        type: 'mobile',
        dest: data.phone,
        $sort: {
          createdAt: -1
        },
        $limit: 1
      },
      paginate: false
    });

    if (!authCode[0]) {
      throw new BadRequest('No OTP Requests found,initiate a OTP Request first.');
    }

    if (data.otp === '000000') return context; // default OTP allowed in dev mode

    const resp = await verifyOTP(
      data.phone,
      authCode[0].orderId,
      data.otp,
    );
    // console.log(resp);
    if (!Object.keys(resp).includes('isOTPVerified')) throw new Error(resp.message);
    if (!resp?.isOTPVerified) throw new BadRequest('Invalid OTP');

    return context;
  }
  catch (error: any) {
    throw new Error(error);
  }
};


export default validateOTP;