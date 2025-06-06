const request = require('supertest');
const { startServer, app } = require('../src/infrastructure/Server');
const mongoose = require('mongoose');

describe('Tweet API', () => {
    let server;
    const port = 3002;
    let token;
    let tweetId;

    beforeAll(async () => {
        server = startServer(port);
    });

    afterAll(async () => {
        await mongoose.connection.close();
        server.close();
    });

    it('should not register a new tweet with an invalid token', async () => {
        // Arrange
        const newTweet = {
            message: 'Tweet de prueba',
        };

        // Act
        const response = await request(app)
            .post('/api/tweets')
            .send(newTweet)
            .set('Authorization', `Bearer -----`);

        // Assert
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid token');
    });

    it('should get tweets by username', async () => {
        // Act
        const response = await request(app)
            .get('/api/testuser2/tweets')
            .set('Authorization', `Bearer ${token}`);

        // Assert
        expect(response.statusCode).toBe(401);
    });

    it('should not get tweets for a non-existing username', async () => {
        // Act
        const response = await request(app)
            .get('/api/testuser2z/tweets')
            .set('Authorization', `Bearer ${token}`);

        // Assert
        expect(response.statusCode).toBe(401);
    });

    it('should get a tweet by id', async () => {
        // Act
        const response = await request(app)
            .get(`/api/tweets/${tweetId}`)
            .set('Authorization', `Bearer ${token}`);

        // Assert
        expect(response.statusCode).toBe(401);
    });

    it('should not get tweet by invalid id', async () => {
        // Act
        const response = await request(app)
            .get('/api/tweets/1b')
            .set('Authorization', `Bearer ${token}`);

        // Assert
        expect(response.statusCode).toBe(401);
    });

    it('should update a tweet', async () => {
        // Arrange
        const newTweet = {
            message: 'Tweet de prueba Actualizado',
        };

        // Act
        const response = await request(app)
            .put(`/api/tweets/${tweetId}`)
            .send(newTweet)
            .set('Authorization', `Bearer ${token}`);

        // Assert
        expect(response.statusCode).toBe(401);
    });

    it('should show message tweet not found when updating non-existing tweet', async () => {
        // Arrange
        const newTweet = {
            message: 'Tweet de prueba Actualizado',
        };

        // Act
        const response = await request(app)
            .put(`/api/tweets/670442eb63b89b08b8ea10be`)
            .send(newTweet)
            .set('Authorization', `Bearer ${token}`);

        // Assert
        expect(response.statusCode).toBe(401);
    });

    it('should not update a tweet with an invalid token', async () => {
        // Arrange
        const newTweet = {
            message: 'Tweet de prueba',
        };

        // Act
        const response = await request(app)
            .put(`/api/tweets/${tweetId}`)
            .send(newTweet)
            .set('Authorization', `Bearer -----`);

        // Assert
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid token');
    });

    it('should get a feed', async () => {
        // Act
        const response = await request(app)
            .get(`/api/feed`)
            .set('Authorization', `Bearer ${token}`);

        // Assert
        expect(response.statusCode).toBe(401);
    });

    it('should delete a tweet', async () => {
        // Act
        const response = await request(app)
            .delete(`/api/tweets/${tweetId}`)
            .set('Authorization', `Bearer ${token}`);

        // Assert
        expect(response.statusCode).toBe(401);
    });

    it('should not delete a tweet with an invalid id', async () => {
        // Act
        const response = await request(app)
            .delete(`/api/tweets/${tweetId}1`)
            .set('Authorization', `Bearer ${token}`);

        // Assert
        expect(response.statusCode).toBe(401);
    });
});
