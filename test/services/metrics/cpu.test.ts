import app from '../../../src/app';

describe('\'metrics/cpu\' service', () => {
  it('registered the service', () => {
    const service = app.service('metrics/cpu');
    expect(service).toBeTruthy();
  });
});
