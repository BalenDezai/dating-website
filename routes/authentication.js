//  packages used
const express = require('express');
const passport = require('passport');
const middlewere = require('../middleware');
const User = require('../models/user.js');

const router = express.Router();

//  LOGIN ROUTES
router.get('/login', middlewere.isAlreadyLoggedIn, (req, res) => {
  res.render('auth/login');
});

//  other than the self made middleware, there is also passport.authenticate, which authenticates the user when they try to login
router.post('/login', middlewere.isAlreadyLoggedIn, passport.authenticate('local', { successRedirect: '/profiles', failureRedirect: '/login', failureFlash: true }));

//  REGISTER ROUTES
router.get('/register', middlewere.isAlreadyLoggedIn, (req, res) => {
  res.render('auth/register');
});

router.post('/register', middlewere.isAlreadyLoggedIn, (req, res) => {
  //  create a new user variable, assign the properties the values
  const newUser = new User({ username: req.body.username, email: req.body.email });
  /*
  //  register the user in the User database
  //  passing in the user object earlier and the password
  //  then the call back function
  */
  User.register(newUser, req.body.password, (error) => {
    //  if error
    if (error) {
      //  flash the error message to the user
      req.flash('error', `${error.message}`);
      //  then re render with the message
      res.redirect('/register');
    }
    //  otherwise authenticate and redirect
    passport.authenticate('local')(req, res, () => {
      res.redirect('/profiles/new');
    });
  });
});

//  LOGOUTE ROUTE
router.get('/logout', middlewere.MustBeLoggedIn, (req, res) => {
  //  logs out the user
  req.logout();
  //  redirects to front page
  res.redirect('/');
});


//  export the router when this file is required
module.exports = router;
