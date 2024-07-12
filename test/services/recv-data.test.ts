import app from '../../src/app';

describe('\'recv-data\' service', () => {
  it('registered the service', () => {
    const service = app.service('recv-data');
    expect(service).toBeTruthy();
  });
});
