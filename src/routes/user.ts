import express from "express";
const router = express.Router();
import { dataSource } from "../database";
import { User } from "../model";

/* GET users listing. */
router.get("/", async function (req, res, next) {
  const firstUser = "/hahahahaha";
  res.send(firstUser);
});

router.get("/create", async (req, res, next) => {
  const user = new User();
  user.firstName = "yinpo" + Math.round(Math.random() * 1000);
  user.password = "" + Math.round(Math.random() * 100000);

  const postRepository = dataSource.getRepository(User);

  const result = await postRepository
    .save(user)
    .then((user) => {
      console.log("Post has been saved: ", user);
    })
    .catch((error) => console.log("Cannot save. Error: ", error));

  res.send(result);
});

export default router;
