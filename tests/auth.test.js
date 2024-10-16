const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Your express app
const User = require('../models/User'); // Adjust the path as needed

// Connect to MongoDB before all tests
beforeAll(async () => {
  const uri = process.env.MONGODB_URI; // Replace this with your actual MongoDB URI
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

// Disconnect from MongoDB after all tests
afterAll(async () => {
  await mongoose.disconnect();
});

describe('User Authentication Tests', () => {
  it('Should sign up a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'talk2kayceenow@gmail.com',
        password: 'Test1234!'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });

  it('Should Prevent Dublicate Registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'talk2kayceenow@gmail.com',
        password: 'Test1234!'
      });
  });

  it('Should Verify OTP', async () => {
    const res = await request(app)
      .post('/api/auth/verify_otp')
      .send({
        email: 'talk2kayceenow@gmail.com',
        otp_code: ''
      });
  });

  it('Should Create OTP', async () => {
    const res = await request(app)
      .post('/api/auth/create_otp')
      .send({
        email: 'talk2kayceenow@gmail.com',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'OTP sent successfully to your email');
  }); // 10-second timeout



  // You can uncomment this test once the login route is set up
  /*
  it('Should login an existing user', async () => {
      const res = await request(app)
          .post('/api/auth/login')
          .send({
              email: 'talk2kayceenow@gmail.com',
              password: 'Test1234!'
          });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
  });
  */
});
