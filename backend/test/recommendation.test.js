const request = require('supertest');
const app = require('../app');

describe('POST /api/recommend', () => {
  it('should return 400 if embedding_id is missing', async () => {
    const res = await request(app)
      .post('/api/recommend')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  // Add more tests here, e.g. with a valid embedding_id and mocking services
}); 