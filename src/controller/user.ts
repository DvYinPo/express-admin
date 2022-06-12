import express, { Request, Response, NextFunction, RequestHandler } from 'express';
const router = express.Router();
import { dataSource, redis } from '../database';
import { User } from '../model';
import { encryption, signToken, valid, sendMessage } from '../util';

/**
 * index
 * @returns '/user'
 */
export const index = (req: Request, res: Response, next: NextFunction): Promise<RequestHandler> => {
  res.send('/user');
  return;
};

/**
 * 用户注册
 * @param req.body.name string
 * @param req.body.password string
 * @param req.body.email string
 * @param req.body.phoneNumber string
 * @param req.body.avatar string
 * @method POST
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<RequestHandler> => {
  const repository = dataSource.getRepository(User);
  const user = await repository.findOneBy([
    { name: req.body.name },
    { email: req.body.email },
    { phoneNumber: req.body.phoneNumber },
  ]);

  if (user) {
    res.status(403).json({
      code: 100,
      msg: 'name, email or phoneNumber exited!',
    });
    return;
  }

  const { name, password, email, phoneNumber, avatar } = req.body;

  await repository.insert({
    name,
    password: encryption(password),
    email,
    phoneNumber,
    avatar,
  });

  res.status(200).json({
    code: 0,
    msg: `${name} register success`,
  });
  return;
};

/**
 * 账号密码登录
 * @param req.body.name string
 * @param req.body.password string
 * @method POST
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<RequestHandler> => {
  const { name, password } = req.body;
  const repository = dataSource.getRepository(User);
  const user = await repository.findOneBy({ name, password: encryption(password) });

  if (!user) {
    res.status(403).json({
      code: 100,
      msg: 'name with this password was not found.',
    });
    return;
  }

  const { email, phoneNumber, avatar } = user;

  const token = signToken({ name, email, phoneNumber, avatar });

  // store the generated JWT after login to verify whether it is the correct
  redis.setex(`login:${name}`, 2 * 24 * 60 * 60, token);

  res.status(200).json({
    code: 0,
    msg: `${name} login success`,
    data: {
      token,
    },
  });
  return;
};

/**
 * 个人简介
 * @method GET
 */
export const profile = async (req: Request, res: Response, next: NextFunction): Promise<RequestHandler> => {
  if (!req['jwt']) {
    res.status(401).json({
      code: 100,
      msg: 'Please sign in first!!!',
    });
    return;
  }

  res.status(200).json({
    code: 0,
    data: {
      ...req['jwt'],
    },
  });
  return;
};

/**
 * 获取手机验证码
 * @param { string } req.params.phone
 * @method GET
 */
export const code = async (req: Request, res: Response, next: NextFunction): Promise<RequestHandler> => {
  const { phone } = req.params;

  // 值非法
  console.log('=> valid', phone, valid(phone, 'phone'));

  if (!valid(phone, 'phone')) {
    res.status(403).json({
      code: 100,
      message: 'request phone number!',
    });
    return;
  }

  // 验证 发送条件
  let times = await redis.get(`time_limit:${phone}`);
  if (times && parseInt(times) < 5) {
    // 最多5条短信
    await redis.incr(`time_limit:${phone}`);
  } else if (parseInt(times) >= 5) {
    // 超过次数
    res.status(403).json({
      code: 100,
      message: 'Exceeded the maximum number of daily sends 5!',
    });
    return;
  } else if (times === null) {
    // 初次发送
    await redis.setex(`time_limit:${phone}`, 24 * 60 * 60, 1); // OK
  }
  let ttl = await redis.ttl(`phone_code:${phone}`);
  if (ttl > 0) {
    res.status(403).json({
      code: 100,
      message: 'The verification code still valid, please do not send repeatedly.',
    });
    return;
  }

  const code = Math.ceil(Math.random() * 1000000);
  await redis.setex(`phone_code:${phone}`, 5 * 60, code);

  // 发送验证码
  const result = await sendMessage(phone, code);

  res.status(200).json({
    code: 0,
    message: 'The verification code is successfully sent, valid for less than 5 minutes.',
    ...result,
  });
  return;
};
