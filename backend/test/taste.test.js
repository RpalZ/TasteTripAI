const request = require('supertest');
const app = require('../app');

describe('POST /api/taste', () => {
  it('should return 400 if input is missing', async () => {
    const res = await request(app)
      .post('/api/taste')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /api/taste/similar', () => {
  it('should return 400 if id is missing', async () => {
    const res = await request(app)
      .get('/api/taste/similar');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
}); 