import app from '../../../src/app';

describe('\'metrics/network\' service', () => {
  it('registered the service', () => {
    const service = app.service('metrics/network');
    expect(service).toBeTruthy();
  });
});
