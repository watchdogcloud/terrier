import assert from 'assert';
import app from '../../../src/app';

describe('\'keys/generate\' service', () => {
  it('registered the service', () => {
    const service = app.service('keys/generate');

    assert.ok(service, 'Registered the service');
  });
});
