import express,{ Request, Response, NextFunction } from "express";
const router = express.Router();
import { dataSource } from "../database";
import { User } from "../model";
import { redis } from "../database"
import { encryption, signToken } from "../util"

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

export default router;
