const request = require('supertest');
const app = require('../app');

describe('Authentication Routes', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/signup')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'testpassword',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User created successfully');
  });

  it('should authenticate a user and return a token', async () => {
    const res = await request(app)
      .post('/api/signin')
      .send({
        email: 'testuser@example.com',
        password: 'testpassword',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

 
});