var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const psqlConnection = require('./src/database/connection')

require('dotenv').config({ path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : null });
require('reflect-metadata');

const routerInit = require('./src/routes')

var app = express();

// middleware initialisation
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// router initialisation
routerInit(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404, 'NOT FOUND!!!'));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send('error');
});

// database initialisation
psqlConnection();

module.exports = app;