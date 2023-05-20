import express, { Application } from 'express';

import cors from 'cors';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/user.js';
import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import { getEnv } from './utils/env.js';

dotenv.config();

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: getEnv('FRONTEND_URL'), credentials: true }));
app.use(cookieParser());

app.get('/', (_, res) => {
  res.send('Hello world');
});

app.use('/', userRoutes, authRoutes, productsRoutes);

const PORT = process.env.PORT || 8000;

app
  .listen(PORT, () => {
    console.log(`⚡ Server listening on port ${PORT} ⚡`);
  })
  .on('error', error => {
    console.error(error);
  });
