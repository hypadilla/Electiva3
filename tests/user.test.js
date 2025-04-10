const request = require('supertest');
const { startServer, app } = require('../src/infrastructure/Server');
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

describe('User API', () => {
  let server;
  const port = 3003;
  let token;

  beforeAll(async () => {
    server = startServer(port);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  it('should register a new user with random data', async () => {
    const randomUsername = faker.internet.userName();
    const randomEmail = faker.internet.email();
    const randomName = faker.person.fullName();
    const randomPassword = faker.internet.password();

    //Arrange
    const newUser = {
      username: randomUsername,
      password: randomPassword,
      email: randomEmail,
      name: randomName,
    };

    //Act
    const response = await request(app)
      .post('/api/auth/register')
      .send(newUser);

    //Assert
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.username).toBe(randomUsername);
  });

  it('should not register a user if username already exists', async () => {
    // Arrange
    const newUser = {
      username: 'testuser',
      password: 'testuser',
      email: 'test@example.com',
      name: 'Test User',
    };

    // Act
    const response = await request(app)
      .post('/api/auth/register')
      .send(newUser);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'A user with this username already exists');
  });

  it('should log in and get a valid token', async () => {
    // Arrange
    const loginData = {
      username: 'testuser',
      password: 'testuser',
    };

    // Act
    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.username).toBe('testuser');

    token = response.body.token;
  });

  it('should not log in with non-existing username', async () => {
    // Arrange
    const loginData = {
      username: 'testuser-1',
      password: 'testuser',
    };

    // Act
    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData);

    // Assert
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'Authentication failed: User not found.');
  });

  it('should retrieve authenticated user details', async () => {
    // Arrange
    // Act
    const response = await request(app)
      .get('/api/me')
      .set('Authorization', `Bearer ${token}`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username');
  });

  it('should return 401 for invalid token when fetching user details', async () => {
    // Arrange
    // Act
    const response = await request(app)
      .get('/api/me')
      .set('Authorization', `Bearer Error_Token`);

    // Assert
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid token');
  });

  it('should log out the user successfully', async () => {
    // Arrange
    // Act
    const response = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Logged out successfully');
  });

  it('should return 400 if authorization header is missing during logout', async () => {
    // Arrange
    // Act
    const response = await request(app)
      .post('/api/auth/logout');

    // Assert
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Authorization header missing');
  });

  it('should return 401 on logout with invalid token', async () => {
    // Arrange
    // Act
    const response = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', 'Bearer invalid-token');

    // Assert
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid token');
  });
});
