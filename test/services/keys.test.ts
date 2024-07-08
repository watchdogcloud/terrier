import assert from 'assert';
import app from '../../src/app';

describe('\'keys\' service', () => {
  it('registered the service', () => {
    const service = app.service('keys');

    assert.ok(service, 'Registered the service');
  });
});
