import jwt from 'jsonwebtoken';
import { isPlainObject } from 'lodash';

export const signToken = (payload: object, options?: jwt.SignOptions): string =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d',
    ...options,
  });

export const verifyToken = (token: string): string | jwt.JwtPayload => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (isPlainObject(payload)) {
      payload['valid'] = true;
      return payload;
    }

    return {
      valid: false,
      message: 'Authentication token is invalid.',
    };
  } catch (error) {
    return {
      valid: false,
      ...error,
    };
  }
};
