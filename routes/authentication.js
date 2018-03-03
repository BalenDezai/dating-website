'use strict';

//  packages used
var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    middlewere  = require("../middleware"),
    User        = require("../models/user.js");

//  LOGIN ROUTES
router.get("/login", middlewere.isAlreadyLoggedIn, function(req, res) {
    res.render("auth/login");
});

//  other than the self made middleware, there is also passport.authenticate, which authenticates the user when they try to login
router.post("/login", middlewere.isAlreadyLoggedIn, passport.authenticate("local", {successRedirect: "/profiles", failureRedirect: "/login"}), function(req, res) {
    
});

//  REGISTER ROUTES
router.get("/register", middlewere.isAlreadyLoggedIn, function(req,res){
    res.render("auth/register");
});

router.post("/register", middlewere.isAlreadyLoggedIn, function(req,res){
    //  create a new user variable, assign the properties the values
    var newUser = new User({username: req.body.username, email: req.body.email});
    //  register the user in the User database, passing in the user object earlier and the password, then the call back function
    User.register(newUser, req.body.password, function(error, user){
        //  if error
        if(error){
            //  flash the error message to the user
            req.flash("error", "" + error.message)
            //  then re render with the message
            return res.render("auth/register");
        }
        //  otherwise authenticate and redirect
        passport.authenticate("local")(req,res,function(){
            res.redirect("/profiles/new");
        });
    });
});

//  LOGOUTE ROUTE
router.get("/logout", middlewere.isLoggedIn, function(req, res) {
    //  logs out the user
    req.logout();
    //  redirects to front page
    res.redirect("/");
});


//  export the router when this file is required
module.exports = router;