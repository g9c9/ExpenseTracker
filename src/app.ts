import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import env from './validations/env.validation';
import morgan from 'morgan';
import usersAPIRoutes from './apis/users.api';
import transactionsAPIRoutes from './apis/transactions.api';
import { ClientError } from './errors/client.error';

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(
  cors({
    origin: env.APP_ORIGIN,
  }),
);
app.use(express.json());
// Handle json parsing failures
app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'Invalid JSON format in body of request' });
    return;
  }
  next();
});
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/api/users', usersAPIRoutes);
app.use('/api/transactions', transactionsAPIRoutes);

// Handle client errors and internal server errors and return cleaned up response to users
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ClientError) {
    res.status(err.statusCode).json({error: err.message});
    return;
  }
  console.error(' ❌ Uncaught error: ', err);
  res.status(500).json({
    error: 'Something went wrong. Please try again later.',
    details: env.NODE_ENV === 'dev' ? err.message : undefined,
  });
});

export default app;
