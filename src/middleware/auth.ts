import { NextFunction, Request, RequestHandler, Response } from 'express';
import { verifyToken } from '../util/authToken';
import { dataSource, redis } from '../database';
import createError from 'http-errors';
import { User } from '../model';

export default async (req: Request, res: Response, next: NextFunction): Promise<RequestHandler> => {
  const header = req.get('Authorization') || '';
  const [b, t] = header.split(' ');
  const token = b === 'Bearer' && t ? t : null;

  const JWTUser = verifyToken(token);

  const jwt = await redis.get(`login:${JWTUser.name}`);
  if (jwt !== token) {
    next(createError(401, 'Warning! Login information has updated, please login again'));
  }

  if (JWTUser.valid) {
    const userRepository = dataSource.getRepository(User);
    const currentUser = await userRepository.findOneBy({
      id: JWTUser.id,
      name: JWTUser.name,
    });
    req['currentUser'] = currentUser;
  }
  next();
  return;
};
