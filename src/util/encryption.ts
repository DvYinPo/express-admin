import crypto from 'crypto';

export const encryption = (data: crypto.BinaryLike): string => {
  return crypto.createHmac('sha1', process.env.CRYPTO_SECRET).update(data).digest('hex');
};
