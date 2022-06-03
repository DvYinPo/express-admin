import express,{ Request, Response, NextFunction } from "express";
const router = express.Router();
import { dataSource } from "../database";
import { User } from "../model";
import { redis } from "../database"
import { encryption, signToken, valid, sendMessage } from "../util"

/* GET users listing. */
router.get("/", async function (req: Request, res: Response, next: NextFunction) {
  res.send("/user");
});

// todo: unique verification for 'email' and 'phoneNumber'
router.post("/register", async (req: Request, res: Response, next: NextFunction) => {

  const repository = dataSource.getRepository(User);
  const user = await repository.findOneBy({ name: req.body.name });

  if (user) {
    res.status(403).json({
      code: 100,
      msg: 'user exited!',
    });
    return;
  }

  const { name, password, email, phoneNumber, avatar } = req.body

  await repository.insert({
    name,
    password: encryption(password),
    email,
    phoneNumber,
    avatar,
  });

  res.status(200).json({
    code: 0,
    msg: `${name} register success`
  });

});

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {

  const { name, password } = req.body
  const repository = dataSource.getRepository(User);
  const user = await repository.findOneBy({ name, password: encryption(password) });

  if (!user) {
    res.status(403).json({
      code: 100,
      msg: 'name with this password was not found.',
    });
    return;
  }

  const token = signToken({ name });

  redis.setex(`login:${name}`, 2 * 24 * 60 * 60, token);

  res.status(200).json({
    code: 0,
    msg: `${name} login success`,
    data: {
      token,
    }
  });

});

router.get("/code/:phone",async (req: Request, res: Response, next: NextFunction) => {
  const { phone } = req.params

  // 值非法
  console.log('=> valid', phone, valid(phone, 'phone'));

  if (!valid(phone, 'phone')) {
    res.status(403).json({
      code: 100,
      message: 'request phone number!'
    })
    return;
  };

  // 验证 发送条件
  let times = await redis.get(`time_limit:${phone}`);
  if (times && parseInt(times) < 5) { // 最多5条短信
    await redis.incr(`time_limit:${phone}`);
  } else if (parseInt(times) >= 5) { // 超过次数
    res.status(403).json({
      code: 100,
      message: "Exceeded the maximum number of daily sends 5!"
    })
    return;
  } else if (times === null) { // 初次发送
    await redis.setex(`time_limit:${phone}`, 24 * 60 * 60, 1); // OK
  }
  let ttl = await redis.ttl(`phone_code:${phone}`);
  if (ttl > 0) {
    res.status(403).json({
      code: 100,
      message: "The verification code still valid, please do not send repeatedly."
    })
    return;
  }

  const code = Math.ceil(Math.random() * 1000000);
  await redis.setex(`phone_code:${phone}`, 5 * 60, code);

  // 发送验证码
  const result = await sendMessage(phone, code);

  res.status(200).json({
    code: 0,
    message: "The verification code is successfully sent, valid for less than 5 minutes.",
    ...result
  });

})

export default router;
