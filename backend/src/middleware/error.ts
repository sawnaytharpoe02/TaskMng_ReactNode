import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODES } from '../helpers/status';
import { ErrorResponse } from '../helpers/interfaces';

const routeNotFoundHandler = (_req: Request, _res: Response, next: NextFunction): void => {
  const error: Error & { status?: number } = new Error('Route not found');
  error.status = HTTP_STATUS_CODES.NOT_FOUND;
  next(error);
};

const errorHandler = (err: ErrorResponse, _req: Request, res: Response, _next: NextFunction) => {
  const status: number = err.status || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  const message: string = err.message || 'Unknown error occurred';
  const stack: string | undefined = err.stack;
  const response: ErrorResponse = {
    status,
    message,
    stack,
  };
  res.status(status).json(response);
};

export { routeNotFoundHandler, errorHandler };
