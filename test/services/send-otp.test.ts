import assert from 'assert';
import app from '../../src/app';

describe('\'send-otp\' service', () => {
  it('registered the service', () => {
    const service = app.service('send-otp');

    assert.ok(service, 'Registered the service');
  });
});
