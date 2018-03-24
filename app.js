'use strict';

//  packages used
var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    flash       = require('connect-flash'),
    passport    = require('passport'),
    localStrat  = require('passport-local'),
    methodOver  = require('method-override'),
    Profile     = require('./models/profile'),
    User        = require('./models/user'),
    middlewere  = require('./middleware');

//  self made route packages
var profileRoutes   = require('./routes/profiles'),
    authRoutes      = require('./routes/authentication');

//  connects to the database
mongoose.connect('mongodb://localhost/Dating');
//  so i can use the body portion of the request
app.use(bodyParser.urlencoded({extended: true}));

//  so i can use utilities such as images/stylesheets/etc
app.use(express.static(__dirname + '/public'));
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
    secret: "aerysecretwordforthesite",
    resave: false,
    saveUninitialized: false
}));

//  initialize passport and tell app to use it
app.use(passport.initialize());
//  initialize passport session and tell app to use it
app.use(passport.session());

//  use authenticate method of User in a local strategy in own database
passport.use(new localStrat(User.authenticate()));

//serialization and deserialization of model for passport session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', middlewere.isAlreadyLoggedIn, function(req,res){
    res.render('landing');
});

//  add this middleware to express, so some variables can be injected into every html page
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

//  add our routes into the stack
app.use(profileRoutes);
app.use(authRoutes);

//  listens on the specific port and ip adress for request, also starts up the server
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server has started");
});


