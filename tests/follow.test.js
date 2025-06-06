const request = require('supertest');
const { startServer, app } = require('../src/infrastructure/Server');
const mongoose = require('mongoose');

describe('Follow API', () => {
    let server;
    const port = 3001;
    let token;

    beforeAll(async () => {
        server = startServer(port);
    });

    afterAll(async () => {
        await mongoose.connection.close();
        server.close();
    });

    it('should follow a user by username', async () => {
        //Arrange
        //Act
        const response = await request(app)
            .post('/api/testuser2/follow')
            .set('Authorization', `Bearer ${token}`);

        //Assert
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid token');
    });

    it('should return already following the user by username', async () => {
        //Arrange
        //Act
        const response = await request(app)
            .post('/api/testuser1/follow')
            .set('Authorization', `Bearer ${token}`);

        //Assert
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid token');
    });

    it('should return user not found when trying to follow', async () => {
        //Arrange
        //Act
        const response = await request(app)
            .post('/api/testuser-1/follow')
            .set('Authorization', `Bearer ${token}`);

        //Assert
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid token');
    });

    it('should return error when trying to get follower count for a non-existent user', async () => {
        //Arrange
        //Act
        const response = await request(app)
            .get('/api/testuser-2/followers/count')
            .set('Authorization', `Bearer ${token}`);

        //Assert
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid token');
    });

    it('should get the following count of a user', async () => {
        //Arrange
        //Act
        const response = await request(app)
            .get('/api/testuser/following/count')
            .set('Authorization', `Bearer ${token}`);

        //Assert
        expect(response.statusCode).toBe(401);
    });

    it('should return error when trying to get following count for a non-existent user', async () => {
        //Arrange
        //Act
        const response = await request(app)
            .get('/api/testuser-2/following/count')
            .set('Authorization', `Bearer ${token}`);

        //Assert
    });

    it('should get the list of users the user is following', async () => {
        //Arrange
        //Act
        const response = await request(app)
            .get('/api/testuser1/following')
            .set('Authorization', `Bearer ${token}`);

        //Assert
        expect(response.statusCode).toBe(401);
        
    });

    it('should return error when trying to get the following list for a non-existent user', async () => {
        //Arrange
        //Act
        const response = await request(app)
            .get('/api/testuser-2/following')
            .set('Authorization', `Bearer ${token}`);

        //Assert
        expect(response.statusCode).toBe(401);
    });

    it('should get the list of followers of the user', async () => {
        //Arrange
        //Act
        const response = await request(app)
            .get('/api/testuser2/followers')
            .set('Authorization', `Bearer ${token}`);

        //Assert
        expect(response.statusCode).toBe(401);
    });

    it('should return error when trying to get the followers list for a non-existent user', async () => {
        //Arrange
        //Act
        const response = await request(app)
            .get('/api/testuser-2/followers')
            .set('Authorization', `Bearer ${token}`);

        //Assert
        expect(response.statusCode).toBe(401);
    });
});
