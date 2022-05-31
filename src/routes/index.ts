var express = require('express');
var router = express.Router();

/* routes */
const routeList = {
    '/': router,
    '/users': require('./users'),
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('<h1>hello express!</h1>');
});


module.exports = app => {
    Object.keys(routeList).forEach(path => {
        app.use(path, routeList[path]);
    })
};