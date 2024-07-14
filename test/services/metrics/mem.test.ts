import app from '../../../src/app';

describe('\'metrics/mem\' service', () => {
  it('registered the service', () => {
    const service = app.service('metrics/mem');
    expect(service).toBeTruthy();
  });
});
