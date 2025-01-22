var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const expressSession = require('express-session');
const passport = require('passport');
const flash = require("connect-flash")


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(flash());
//This code sets up session management in an Express app using the express-session middleware, storing session data securely on the server with a secret key
app.use(expressSession({ 
  resave: false,
  saveUninitialized: false,
  secret: "hello hey hi"
  })); 

  app.use(passport.initialize()); //Initializes Passport, setting it up to handle authentication requests
  app.use(passport.session());//Enables session management with Passport, storing user sessions securely. Passport uses sessions to keep track of authenticated users across requests.
  passport.serializeUser(usersRouter.serializeUser()); // it converts the user data (typically the entire user object) into a format that can be stored in the session (e.g., a simple user ID or a unique identifier).
  passport.deserializeUser(usersRouter.deserializeUser()); //This line tells Passport how to take the stored session data (usually just an ID) and convert it back into a full user object.
  //usersRouter.serializeUser() and usersRouter.deserializeUser() are methods which usually interact with the database to fetch or store user information.


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
