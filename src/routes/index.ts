import express,{ Express, Request, Response, NextFunction } from "express";
const router = express.Router();
import user from "./user";

/* routes */
const routeList = {
  "/": router,
  "/user": user,
};

/* GET home page. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.send("<h1>hello express!</h1>");
});

export default (app: Express) => {
  Object.keys(routeList).forEach((path) => {
    app.use(path, routeList[path]);
  });
};
