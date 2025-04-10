const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation Clone X',
      version: '1.0.0',
      description: 'Documentation for the Clone X project',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'password', 'email', 'name'],
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
            },
            username: {
              type: 'string',
              description: 'The username of the user',
            },
            password: {
              type: 'string',
              description: 'The password of the user',
            },
            email: {
              type: 'string',
              description: 'The email of the user',
            },
            name: {
              type: 'string',
              description: 'The name of the user',
            },
          },
        },
        Follow: {
          type: 'object',
          required: ['followerId', 'followingId'],
          properties: {
            followerId: {
              type: 'string',
              description: 'The ID of the user who follows',
            },
            followingId: {
              type: 'string',
              description: 'The ID of the user being followed',
            },
            followedDate: {
              type: 'string',
              format: 'date-time',
              description: 'Date when the follow relationship was created',
            },
          },
        },
        Tweet: {
          type: 'object',
          required: ['message', 'createdBy'],
          properties: {
            id: {
              type: 'string',
              description: 'Tweet ID',
            },
            message: {
              type: 'string',
              description: 'The content of the tweet',
              maxLength: 280,
            },
            createdDate: {
              type: 'string',
              format: 'date-time',
              description: 'Date when the tweet was created',
            },
            createdBy: {
              type: 'string',
              description: 'ID of the user who created the tweet',
            },
          },
        },
      },
    },
  },
  apis: [
    './src/infrastructure/express/routes/*.js',
    './src/adapters/controllers/*.js',
  ],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

const swaggerDocs = (app, port) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Version 1 Docs are available at http://localhost:${port}/api-docs`);
};

module.exports = swaggerDocs;
