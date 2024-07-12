import app from '../../src/app';

describe('\'kafka-administration\' service', () => {
  it('registered the service', () => {
    const service = app.service('kafka-administration');
    expect(service).toBeTruthy();
  });
});
