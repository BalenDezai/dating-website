'use strict';

//  packages used
var express     = require('express'),
    router      = express.Router(),
    Profile     = require('../models/profile.js'),
    User        = require('../models/user.js'),
    middlewere  = require('../middleware'),
    multer      = require('multer'),
    path        = require('path'),
    moment      = require('moment'),
    fs          = require('fs');

//  create a story for multer
var storage = multer.diskStorage({
    //  give the destination property a path
    destination: './public/images/ProfilePictures',
    //  give a name to the uploaded file by using a function
    filename: function (req, file, cb) {
        //  use a function inside of the crypto package to create random bytes of the size of 16
        require('crypto').pseudoRandomBytes(16, function (err, raw) {
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
router.get('/profiles', middlewere.MustBeLoggedIn, middlewere.MustHaveProfile, function(req, res) {
    Profile.find({}, function(error, allProfiles){
        if(error){
            req.flash('error', "" + error.message);
            res.render('profiles/index');
        } else {
            res.render('profiles/index', {profile: allProfiles });
        }
    });
    
});

//  NEW ROUTE
router.get('/profiles/new', middlewere.MustBeLoggedIn, function(req, res) {
    res.render('profiles/new');
});

//  SHOW ROUTE
router.get('/profiles/:id', middlewere.MustBeLoggedIn,middlewere.MustHaveProfile, function(req, res) {
    Profile.findById(req.params.id, function(error, foundProfile){
        if(error){
            req.flash('error', "" + error.message);
            res.render('profiles/index');
        } else {
            res.render('profiles/show',{profile: foundProfile});
        }
    });
});


//  CREATE ROUTE
router.post('/profiles', middlewere.MustBeLoggedIn, upload.single('profileImage'), function(req, res) {
    
    if (!req.file) {
        req.flash('error', "You have to upload an image");
        res.redirect('back');
    }
    
    var formatedDate = moment(req.body.born).format('YYYY-MM-DD');
    
    var newProfile = {firstname: req.body.firstname, lastname: req.body.lastname,registered: moment(), born: formatedDate, gender: req.body.gender, age: moment().diff(moment(formatedDate, 'YYYY-MM-DD'), 'years') , profileImage: req.file.filename.toString(), description: req.body.description};

    Profile.create(newProfile, function(error, newAddedProfile){
        if(error){
            
            req.flash('error', "" + error.message);
            res.redirect('profiles/new');
            
        } else {
            
            var UsersProfile = {id: newAddedProfile._id, firstname: newAddedProfile.firstname };
            
            User.findByIdAndUpdate(req.user._id, {profile : UsersProfile }, function(error, updatedUser) {
                if (error) {
                    req.flash('error', "" + error.message);
                    res.redirect('profiles/new');
                }
                 res.redirect('/profiles');
            });
        }
    });
});


//  EDIT ROUTE
router.get('/profiles/:id/edit', middlewere.MustBeLoggedIn, middlewere.MustHaveProfile,  function(req,res){
    
    Profile.findById(req.params.id, function(error, foundProfile) {
        res.render('profiles/edit', {profile: foundProfile});
    });
    
});

//  UPDATE ROUTE
router.put('/profiles/:id',middlewere.MustBeLoggedIn, middlewere.MustHaveProfile, upload.single('profileImage'), function(req,res){
    
    Profile.findByIdAndUpdate(req.params.id, {firstname: req.body.firstname, lastname: req.body.lastname, gender: req.body.gender, profileImage: req.file.filename.toString(), description: req.body.description}, function(error, updatedProfile){
        if (error){
            req.flash('error', "" + error.message);
            res.redirect('profiles/' + req.params.id + '/edit');
        } else {
            res.redirect('/profiles/' + req.params.id);
        }
    });
});

// DELETE ROUTE
router.delete('/profiles/:id',middlewere.MustBeLoggedIn, middlewere.MustHaveProfile, function(req,res){
    
    Profile.findByIdAndRemove(req.params.id, function(error, deletedData){
       if(error){
           req.flash('error', "" + error.message);
           res.redirect('/profiles' + req.params.id);
       } else {
           fs.unlink("" + __dirname + '/../public/images/ProfilePictures/' + deletedData.profileImage, function(error){
               if (error) {
                   req.flash('error', "" + error.message);
                   res.redirect('/profiles' + req.params.id);
               }
           });
           
           console.log(deletedData._id);
           User.findByIdAndUpdate(req.user._id, {profile : undefined }, function(error, updatedUser){
               if (error) {
                   req.flash('error', "" + error.message);
                   res.redirect('/profiles');
               } else {
                   
                   res.redirect('/profiles');
               }
           });
           
       }
   });
});

module.exports = router;