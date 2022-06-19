import { Request, Response, NextFunction, RequestHandler } from 'express';
import createError from 'http-errors';
import { has } from 'lodash';
import { dataSource, redis } from '../database';
import { Login, User } from '../model';
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
  const { name, password, email, phoneNumber, avatar } = req.body;

  const repository = dataSource.getRepository(User);
  const user = await repository.findOneBy([{ name }, { email }, { phoneNumber }]);

  // user repeated
  if (user) {
    let invalid =
      user.name === name
        ? 'name'
        : user.email === email
        ? 'email'
        : user.phoneNumber === phoneNumber
        ? 'phoneNumber'
        : 'user';

    res.status(403).json({
      code: 100,
      msg: `${invalid} exited!`,
    });
    return;
  }

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
  const { name, email, phoneNumber, code, password } = req.body;

  // value valid
  const queryData = {};
  if (!valid.isEmpty(name)) queryData['name'] = name;
  if (!valid.isEmpty(password)) queryData['password'] = encryption(req.body.password);
  if (!valid.isEmpty(email)) queryData['email'] = email;
  if (!valid.isEmpty(phoneNumber)) queryData['phoneNumber'] = phoneNumber;
  if (!valid.isEmpty(code)) queryData['code'] = code;

  if (
    !(has(queryData, 'name') && has(queryData, 'password')) &&
    !(has(queryData, 'email') && has(queryData, 'password')) &&
    !(has(queryData, 'phoneNumber') && has(queryData, 'password')) &&
    !(has(queryData, 'phoneNumber') && has(queryData, 'code'))
  ) {
    next(createError(403, 'Warning! Parameter is required!!!'));
    return;
  }

  // todo: code to login and register
  const repository = dataSource.getRepository(User);
  const user = await repository.findOne({
    where: { ...queryData },
    relations: {
      login: true,
    },
  });

  if (!user) {
    res.status(403).json({
      code: 100,
      msg: 'name with this password was not found.',
    });
    return;
  }

  // create login information
  await dataSource.getRepository(Login).insert({
    ip: req.ip,
    mac: req['mac'],
    user: user,
  });

  const { avatar, login } = user;

  const token = signToken({ name, email, phoneNumber, avatar, login });

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
  if (!req['currentUser']) {
    res.status(401).json({
      code: 100,
      msg: 'Please sign in first!!!',
    });
    return;
  }

  res.status(200).json({
    code: 0,
    data: {
      ...req['currentUser'],
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
  console.log('=> valid', phone, valid.phone(phone));

  if (!valid.phone(phone)) {
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
