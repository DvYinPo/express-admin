var express = require('express');
var router = express.Router();
const { getConnection } = require("typeorm");
const { User } = require('../model');

/* GET users listing. */
router.get('/', async function(req, res, next) {
    const firstUser = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([{ firstName: "Timber", lastName: "Saw" }, { firstName: "Phantom", lastName: "Lancer" }])
        .execute();
    res.send(firstUser);
});

module.exports = router;