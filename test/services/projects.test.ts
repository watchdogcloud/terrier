import assert from 'assert';
import app from '../../src/app';

describe('\'projects\' service', () => {
  it('registered the service', () => {
    const service = app.service('projects');

    assert.ok(service, 'Registered the service');
  });
});
