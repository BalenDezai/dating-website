'use strict';

//  packages used
var express     = require("express"),
    router      = express.Router(),
    Profile     = require("../models/profile.js"),
    middlewere  = require("../middleware"),
    multer      = require('multer'),
    path        = require('path');

//  create a story for multer
var storage = multer.diskStorage({
    //  give the destination property a path
    destination: './public/images/ProfilePictures',
    //  give a name to the uploaded file by using a function
    filename: function (req, file, cb) {
        //  use a function inside of the crypto package to create random bytes of the size of 16
        require("crypto").pseudoRandomBytes(16, function (err, raw) {
            if (err){
                return cb(err);
            } else {
                //  first find the extension of uploadd file using the path.extname
                //  then turn the raw numbers to a hexadecimal string, and add the extension to it
                //  then return the random generated name with its original extension name
                cb(null, raw.toString('hex') + path.extname(file.originalname));
                
            }
    });
  }
});

//  where multer should store the files
var upload = multer({ storage: storage });

//  RESTFUL PROFILE ROUTES

//  INDEX ROUTE
router.get("/profiles", middlewere.isLoggedIn, function(req, res) {
    Profile.find({}, function(error, allProfiles){
        if(error){
            console.log(error);
        } else {
            res.render("profiles/index", {profile: allProfiles });
        }
    });
    
});

//  NEW ROUTE
router.get("/profiles/new", middlewere.isLoggedIn, function(req, res) {
    res.render("profiles/new");
});

//  SHOW ROUTE
router.get("/profiles/:id", middlewere.isLoggedIn, function(req, res) {
    Profile.findById(req.params.id, function(error, foundProfile){
        if(error){
            
            console.log(error.message);
        } else {
            res.render("profiles/show",{profile: foundProfile});
        }
    });
});


//  CREATE ROUTE
router.post("/profiles", middlewere.isLoggedIn,upload.single('avatar'), function(req, res) {
    var owner = { id: req.user._id, username: req.user.username};
    req.body.Profile.owner = owner;
    Profile.create(req.body.Profile, function(error, newProfile){
        if(error){
            console.log(error);
        }
        res.redirect("/profiles");

    });
});


//  EDIT ROUTE
router.get("/profiles/:id/edit",  function(req,res){
    
});

//  UPDATE ROUTE
router.put("/profiles/:id", function(req,res){
    
});

// DELETE ROUTE
router.delete("/profiles/:id/delete", function(req,res){
    
});

module.exports = router;