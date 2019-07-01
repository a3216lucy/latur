var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var railRouter = require('./routes/rail');
var rail2Router = require('./routes/rail2');
var tnRouter = require('./routes/tn');
var busRouter = require('./routes/bus');
var usersRouter = require('./routes/users');
var startRouter = require('./routes/start');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('public'));


app.use('/', startRouter);
app.use('/index', indexRouter);
app.use('/bus', busRouter);
app.use('/rail', railRouter);
app.use('/rail2', rail2Router);
app.use('/tn', tnRouter);
app.use('/users', usersRouter);
app.use('/start', startRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
