import express, { Express, Request, Response, NextFunction, Router, RequestHandler } from 'express';
const router = express.Router();
import USER from './user';
import { authenticate } from '../middleware';

/* routes */
type routeList = {
  [key: string]: Array<Router | RequestHandler>;
};
const routeList: routeList = {
  '/': [router],
  '/user': [authenticate, USER],
};

/* GET home page. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
  res.send('<h1>hello express!</h1>');
});
router.post('/', function (req: Request, res: Response, next: NextFunction) {
  res.json({
    message: 'hello express!',
    ip: req.ip,
    ips: req.ips,
  });
});

export default (app: Express) => {
  Object.keys(routeList).forEach((path) => {
    app.use(path, ...routeList[path]);
  });
};
