import 'reflect-metadata';
import 'dotenv/config';

import express, {Response, Request, NextFunction, json} from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';

import rateLimiter from '@modules/users/infra/http/middlewares/rateLimiter';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';
import AppError from "@shared/errors/AppError";

const app = express();

app.use(rateLimiter);
app.use(cors());
app.use(json());
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  console.log('🚀 server is up and running!');
});
