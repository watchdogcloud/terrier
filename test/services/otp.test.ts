import assert from 'assert';
import app from '../../src/app';

describe('\'otp\' service', () => {
  it('registered the service', () => {
    const service = app.service('otp');

    assert.ok(service, 'Registered the service');
  });
});
