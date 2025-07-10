const request = require('supertest');
const app = require('../app');

describe('POST /api/booking', () => {
  it('should return 400 if query is missing', async () => {
    const res = await request(app)
      .post('/api/booking')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  // You can add a mock for searchPlaces and test a valid query scenario here
}); 