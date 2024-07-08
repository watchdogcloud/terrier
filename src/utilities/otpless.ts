import axios from 'axios';
import app from '../app';

const BASE_URL = 'https://auth.otpless.app/auth/otp/v1';

export async function sendOTP(
  phoneNumber: string,
  email: string | null,
  channel: string,
  hash: string,
  orderId: string,
  expiry: number,
  otpLength: number,
): Promise<{ message?: string }> {
  try {
    const { clientId, clientSecret } = app.get('otpless');
    const response = await axios.post(`${BASE_URL}/send`, {
      phoneNumber,
      orderId,
      hash,
      otpLength,
      channel,
      expiry,
    },
    {
      headers: {
        clientId,
        clientSecret,
        'Content-Type': 'application/json',
      }
    }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      throw new Error(`Error: ${status} - ${data.message || data.error || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('Error: No response received from server');
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  }

}

export async function resendOTP(
  orderId: string,
): Promise<{ message?: string }> {
  try {

    const { clientId, clientSecret } = app.get('otpless');
    const response = await axios.post(`${BASE_URL}/resend`, {
      orderId,
      clientId,
      clientSecret
    },
    {
      headers: {
        clientId,
        clientSecret,
        'Content-Type': 'application/json',
      }
    }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      throw new Error(`Error: ${status} - ${data.message || data.error || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('Error: No response received from server');
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  }
}

export async function verifyOTP(
  phoneNumber: string,
  orderId: string,
  otp: string,
): Promise<{ isOTPVerified: boolean; message?: string }> {
  try {
    const { clientId, clientSecret } = app.get('otpless');
    const response = await axios.post(`${BASE_URL}/verify`, {
      phoneNumber,
      orderId,
      otp,
    },
    {
      headers: {
        clientId,
        clientSecret,
        'Content-Type': 'application/json',
      }
    }
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      throw new Error(`Error: ${status} - ${data.message || data.error || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('Error: No response received from server');
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  }
}