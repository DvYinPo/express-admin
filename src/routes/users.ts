import express from "express";
const router = express.Router();
import { getConnection } from "typeorm";
import { User } from "../model";

/* GET users listing. */
router.get("/", async function (req, res, next) {
  const firstUser = '/hahahahaha'
  res.send(firstUser);
});

export default router;
