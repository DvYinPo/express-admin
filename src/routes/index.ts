import express from "express";
const router = express.Router();
import user from "./user";

/* routes */
const routeList = {
  "/": router,
  "/user": user,
};

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("<h1>hello express!</h1>");
});

export default app => {
  Object.keys(routeList).forEach((path) => {
    app.use(path, routeList[path]);
  });
};
