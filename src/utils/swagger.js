const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    version: '1.0',
    title: 'Google Keep Clone',
    description: 'Create Notes'
  },
  host: 'localhost:3000',
  basePath: '/api/v1',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Users',
      description: ''
    },
    {
      name: 'Notes',
      description: ''
    }
  ],
  securityDefinitions: {},
  definitions: {}
};

const outputFile = './swagger.json';
const endpointsFiles = ['../routes/user.route'];

swaggerAutogen(outputFile, endpointsFiles, doc);
