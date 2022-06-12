import { NextFunction, Request, RequestHandler, Response } from 'express';
import { verifyToken } from '../util/authToken';
import { redis } from '../database';
import createError from 'http-errors';

export default async (req: Request, res: Response, next: NextFunction): Promise<RequestHandler> => {
  const header = req.get('Authorization') || '';
  const [b, t] = header.split(' ');
  const token = b === 'Bearer' && t ? t : null;

  const JWTUse = verifyToken(token);

  const jwt = await redis.get(`login:${JWTUse.name}`);
  if (jwt !== token) {
    next(createError(401, 'Warning! The JWT seems to be deliberately tampered with!!!'));
  }

  if (JWTUse.valid) {
    req['jwt'] = JWTUse;
  }
  next();
  return;
};
