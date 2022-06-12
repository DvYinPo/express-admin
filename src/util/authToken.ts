import jwt from 'jsonwebtoken';
import { isPlainObject } from 'lodash';

/**
 * jwt加密，默认有效期7天
 * @param payload object
 * @param options object
 * @returns string
 */
export const signToken = (payload: object, options?: jwt.SignOptions): string =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d',
    ...options,
  });

/**
 * jwt解密
 * @param token string
 * @returns valid: boolean
 */
export const verifyToken = (token: string): jwt.JwtPayload => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (isPlainObject(payload)) {
      return {
        valid: true,
        ...(payload as jwt.JwtPayload),
      };
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
