var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);  // session is one imported on line 6
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
const { ifError } = require('assert');

const url = config.mongoUrl;
const connect = mongoose.connect(url);
connect.then((db) => {
  console.log('Connected successfully to server');
}, (err) => { console.log(err); });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-67890-09876-54321'));   // param is secret key (made up) used to sign cookies

// app.use(session({   // set options
//   name: 'session-id',
//   secret: '12345-67890-09876-54321',
//   saveUninitialized: false,
//   resave: false,
//   store: new FileStore()
// }));

app.use(passport.initialize());
// app.use(passport.session());  // once user is logged in, passport will serialize req.user and store in session

app.use('/', indexRouter);
app.use('/users', usersRouter);

// function auth(req, res, next) {
//   console.log("in auth console log with user " + req.user);
//   if(!req.user) {  // if user field not included in signed cookie/session, 
//     var err = new Error('You are not authenticated!');
//     err.status = 401;   // 401 = unauthorized
//     return next(err);  // go to error handler
//   }
//   else {  // if req.user is present, then passport has already successfully done authentication
//       next();
//   }
  // below is before using passport

  // console.log(req.session);
  // if(!req.session.user) {  // if user field not included in signed cookie/session, 
  //   var err = new Error('You are not authenticated!');
  //   err.status = 401;   // 401 = unauthorized
  //   return next(err);  // go to error handler
  // }
  // else {  // signed cookie/session already exists with name user
  //   if(req.session.user === 'authenticated') {
  //     next();
  //   }
  //   else {   // invalid cookie if user does not have value admin (should not occur but to be safe)
  //     var err = new Error('You are not authenticated!');  // but do not prompt with empty auth header
  //     err.status = 401;
  //     return next(err);  // go to error handler
  //   }
  // }
// }
// app.use(auth);    // everything below this that app uses must go through authentication first

app.use(express.static(path.join(__dirname, 'public')));  // allows us to serve static files from folder: 'public'


app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

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
