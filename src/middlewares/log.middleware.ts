import type { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export const loggerRequestMiddleware = (req: Request, res: Response, next: NextFunction) => {
    logger.info({
      method: req.method,
      url: req.url,
      ip: req.ip,
      headers: req.headers,
      body: req.body,
      query: req.query
    });
    next();
};
