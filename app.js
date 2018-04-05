//  packages used
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrat = require('passport-local');
const methodOver = require('method-override');
const User = require('./models/user');
const middlewere = require('./middleware');
const seedDB = require('./seeds');
const path = require('path');
const debug = require('debug')('app');

const app = express();

//  self made route packages
const profileRoutes = require('./routes/profiles');
const authRoutes = require('./routes/authentication');


//  connects to the database
mongoose.connect('mongodb://localhost/Dating');
//  so i can use the body portion of the request
app.use(bodyParser.urlencoded({ extended: true }));


seedDB();

//  so i can use utilities such as images/stylesheets/etc
app.use(express.static(path.join(__dirname, '/public')));
//  set the templating to EJS, means we wont need to end  rendering with .ejs
app.set('view engine', 'ejs');
//  to use the PUT and DELETE method from forms
app.use(methodOver('_method'));
//  for flash messages
app.use(flash());


//  PASSPORT CONFIGURATION

//  use the express session  to start/end seasons with a user
app.use(require('express-session')({
  //  our private key, what we sign a season with
  secret: 'aerysecretwordforthesite',
  resave: false,
  saveUninitialized: false,
}));

//  initialize passport and tell app to use it
app.use(passport.initialize());
//  initialize passport session and tell app to use it
app.use(passport.session());

//  use authenticate method of User in a local strategy in own database
passport.use(new LocalStrat(User.authenticate()));

//  serialization and deserialization of model for passport session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', middlewere.isAlreadyLoggedIn, (req, res) => {
  res.render('landing');
});

//  add this middleware to express, so some variables can be injected into every html page
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

//  add our routes into the stack
app.use(profileRoutes);
app.use(authRoutes);

//  listens on the specific port and ip adress for request, also starts up the server
app.listen(process.env.PORT, process.env.IP, () => {
  debug(`Server has started on port ${process.env.PORT}`);
});
