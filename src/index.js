import dotenv from 'dotenv';
dotenv.config();

import express, { raw } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import routes from './routes';
import database from './config/database';
import {
  appErrorHandler,
  genericErrorHandler,
  notFound
} from './middlewares/error.middleware';
import logger, { logStream } from './config/logger';

import morgan from 'morgan';
// import swaggerDoc from "./config/swagger.json";
// import swaggerUi from 'swagger-ui-express';
import init from './kafka/admin.js';

const app = express();
const host = process.env.APP_HOST;
const port = process.env.APP_PORT;
const api_version = process.env.API_VERSION;

app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('combined', { stream: logStream }));
database();
init().then(() => {
  console.log('Kafka successfully started');
});

// app.use(`/api-docs`,swaggerUi.serve,swaggerUi.setup(swaggerDoc));

app.use(`/api/${api_version}`, routes());
app.use(appErrorHandler);
app.use(genericErrorHandler);
app.use(notFound);

app.listen(port, async () => {
  logger.info(`Server started at ${host}:${port}/api/${api_version}/`);
});

export default app;
