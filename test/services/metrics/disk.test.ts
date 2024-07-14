import app from '../../../src/app';

describe('\'metrics/disk\' service', () => {
  it('registered the service', () => {
    const service = app.service('metrics/disk');
    expect(service).toBeTruthy();
  });
});
