//  packages used
const express = require('express');
const Profile = require('../models/profile.js');
const User = require('../models/user.js');
const middlewere = require('../middleware');
const multer = require('multer');
const path = require('path');
const moment = require('moment');
const fs = require('fs');
const request = require('request');
const countryISO = require('countrynames');
const crypto = require('crypto');

const router = express.Router();

//  create a story for multer
const storage = multer.diskStorage({
  //  give the destination property a path
  destination: './public/images/ProfilePictures',
  //  give a name to the uploaded file by using a function
  filename: (req, file, cb) => {
    //  use a function inside of the crypto package to create random bytes of the size of 16
    crypto.pseudoRandomBytes(16, (err, raw) => {
      if (err) {
        return cb(err);
      }
      //  first find the extension of uploadd file using the path.extname
      //  then turn the raw numbers to a hexadecimal string, and add the extension to it
      //  then return the random generated name with its original extension name
      cb(null, raw.toString('hex') + path.extname(file.originalname));
    });
  }
});

//  where multer should store the files
const upload = multer({ storage: storage });

//  RESTFUL PROFILE ROUTES

//  INDEX ROUTE
router.get('/profiles', middlewere.MustBeLoggedIn, middlewere.MustHaveProfile, (req, res) => {
    var allProfiles = [];
    
    request('http://api.geonames.org/findNearbyPostalCodesJSON?postalcode=' + req.user.profile.postalcode + '&country=' + req.user.profile.countrycode + '&maxRows=10&radius=30&username=balend', function(error, response, body) {
    if(!error && response.statusCode == 200){
        var parsedData = JSON.parse(body);
        for (var i = 0; i < parsedData.postalCodes.length; i++) {
            allProfiles.push(parsedData.postalCodes[i]['postalCode']);
        }
        Profile.paginate({},{page: 1, sort: { registered: 1}, limit: 4}, function(error, everyProfiles){
            if(error){
                req.flash('error', '${error.message}');
                res.render('profiles/index');
            } 
            Profile.paginate({postalcode : { $in: allProfiles }}, {sort: {registered: 1 }, limit: 4}, function(error, nearbyProfiles) {
                res.render('profiles/index', {everyProfile: everyProfiles.docs, nearbyProfile: nearbyProfiles.docs});
            });
            
        });
        
    }});
});

//  NEW ROUTE
router.get('/profiles/new', middlewere.MustBeLoggedIn, (req, res) => {
  res.render('profiles/new');
});

//  SHOW ROUTE
router.get('/profiles/:id', middlewere.MustBeLoggedIn,middlewere.MustHaveProfile, (req, res) => {
  Profile.findById(req.params.id, function(error, foundProfile){
    if (error) {
      req.flash('error', `${error.message}`);
      res.render('profiles/index');
    } else {
      res.render('profiles/show',{profile: foundProfile});
    }
  });
});


//  CREATE ROUTE
router.post('/profiles', middlewere.MustBeLoggedIn, upload.single('profileImage'), middlewere.ValidateProfileLocation , middlewere.ValidateProfileAge, (req, res) => {
  if (!req.file) {
    req.flash('error', 'You have to upload an image');
    res.redirect('back');
    }
    const formatedDate = moment(req.body.born).format('YYYY-MM-DD');
    const countryCode = countryISO.getCode(req.body.country);
    const ageYears =  moment().diff(moment(formatedDate, 'YYYY-MM-DD'), 'years');
    
    var newProfile = {firstname: req.body.firstname, lastname: req.body.lastname, street: req.body.street, city: req.body.city, postalcode: req.body.postalcode, country: req.body.country, countrycode: countryCode ,registered: moment(), born: formatedDate, gender: req.body.gender, age: ageYears , profileImage: req.file.filename.toString(), description: req.body.description};

        Profile.create(newProfile, function(error, newAddedProfile){
                if(error){
                    
                    req.flash('error', `${error.message}`);
                    res.redirect('profiles/new');
                    
                } else {
                    
                var UsersProfile = {id: newAddedProfile._id, firstname: newAddedProfile.firstname, postalcode: newAddedProfile.postalcode, countrycode: newAddedProfile.countrycode };
                    
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
router.get('/profiles/:id/edit', middlewere.MustBeLoggedIn, middlewere.MustHaveProfile, (req,res) => {
  Profile.findById(req.params.id, (error, foundProfile) => {
    res.render('profiles/edit', { profile: foundProfile });
  });
});

//  UPDATE ROUTE
router.put('/profiles/:id',middlewere.MustBeLoggedIn, middlewere.MustHaveProfile, upload.single('profileImage'), (req, res) => {
  const updatedProfile = { 
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    street: req.body.street,
    city: req.body.city,
    postalcode: req.body.postalcode,
    country: req.body.country, gender:
    req.body.gender,
    profileImage: req.file.filename.toString(),
    description: req.body.description
  };
  
  Profile.findByIdAndUpdate(req.params.id, updatedProfile , (error, updatedProfile) => {
    if (error) {
      req.flash('error', `${error.message}`);
      res.redirect(`profiles/${req.params.id}/edit`);
    } else {
      res.redirect(`/profiles/${req.params.id}`);
    }
  });
});

// DELETE ROUTE
router.delete('/profiles/:id',middlewere.MustBeLoggedIn, middlewere.MustHaveProfile, (req, res) => {
  Profile.findByIdAndRemove(req.params.id, (error, deletedData) => {
    if (error) {
      req.flash('error', `${error.message}`);
      res.redirect(`/profiles/${req.params.id}`);
    } else {
      fs.unlink(path.join(__dirname, '/../public/images/ProfilePictures/', deletedData.profileImage), (error) => {
        if (error) {
          req.flash('error', `${error.message}`);
          res.redirect(`/profiles/${req.params.id}`);
        }
      });
      User.findByIdAndUpdate(req.user._id, { profile: undefined }, (error) => {
        if (error) {
          req.flash('error', `${error.message}`);
          res.redirect('/profiles');
        } else {
          res.redirect('/profiles');
        }
      });
    }
  });
});

let test = 1;


// AJAX REQUEST ROUTE
router.get('/ajax', middlewere.MustBeLoggedIn, middlewere.MustHaveProfile, (req, res) => {
  Profile.paginate({}, { page: test + 1, sort: { registered: 1 }, limit: 4 }, (error, result) => {
    res.send({ data: result.docs });
    test += 1;
  });
});


router.get('/ajax/return', middlewere.MustBeLoggedIn, middlewere.MustHaveProfile, (req, res) => {
  test -= 1;
  Profile.paginate({}, { page: test, sort: { registered: 1 }, limit: 4 }, (error, result) => {
    res.send({ data: result.docs });
  });
});

module.exports = router;
