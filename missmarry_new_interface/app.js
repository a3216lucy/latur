var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var weatherRouter = require('./routes/weather');
var taipeibusRouter = require('./routes/taipeibus');
var taichungbusRouter = require('./routes/taichungbus');
// var fs = require('fs');

var app = express();
const ejsLint = require('ejs-lint');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/weather', weatherRouter);
app.use('/taipeibus', taipeibusRouter);
app.use('/taichungbus', taichungbusRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); 
  res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); 
  res.header('X-Powered-By', 'nodejs'); 
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});


app.get('/weather', function(req, res) {

  var file = path.join(__dirname, 'C:\\Desktop\\missmarry_new_interface\\weather.json'); 
  //var file = 'f:\\nodejs\\data\\test.json'; //也可以用这种方式指定路径

  fs.readFile(file, 'utf-8', function(err, data) {
      if (err) {
          res.send('fail to load the data.');
      } else {
          res.send(data);
      }
  });
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
