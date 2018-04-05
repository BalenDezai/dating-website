'use strict';

const   request     = require('request'),
        moment      = require('moment'),
        countryISO  = require('countrynames');

var middlewereObject = {};


middlewereObject.MustBeLoggedIn = function MustBeLoggedIn(req,res,next){
    
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};


middlewereObject.isAlreadyLoggedIn = function isAlreadyLoggedIn(req, res, next){
    
    if(req.isAuthenticated()){
        return res.redirect('/profiles');
    }
    return next();
};

middlewereObject.MustHaveProfile = function MustHaveProfile(req, res, next){
    if (!req.user.profile.id) {
        return res.redirect('/profiles/new');
    }
    return next();
};

middlewereObject.ValidateProfileLocation = function ValidateProfileLocation(req, res, next){
    request('http://api.geonames.org/findNearbyPostalCodesJSON?postalcode=' + req.body.postalcode + '&country=' + countryISO.getCode(req.body.country) + '&maxRows=10&radius=30&username=balend', function(error, response, body) {
        if(!error && response.statusCode == 200 && !body.includes("status")){
            return next();
        } else {
            req.flash('error', "the postalcode or country you entered either do not match or do not exist");
            return res.redirect('/profiles/new');
        }
    });
};

middlewereObject.ValidateProfileLocation = function ValidateProfileLocation(req, res, next){
    request('http://api.geonames.org/findNearbyPostalCodesJSON?postalcode=' + req.body.postalcode + '&country=' + countryISO.getCode(req.body.country) + '&maxRows=10&radius=30&username=balend', function(error, response, body) {
        if(!error && response.statusCode == 200 && !body.includes("status")){
            return next();
        } else {
            req.flash('error', "the postalcode or country you entered either do not match or do not exist");
            return res.redirect('/profiles/new');
        }
    });
};

middlewereObject.ValidateProfileAge = function ValidateProfileAge(req, res, next){
    var formatedDate = moment(req.body.born).format('YYYY-MM-DD');
    var ageYears =  moment().diff(moment(formatedDate, 'YYYY-MM-DD'), 'years');
    if (ageYears >= 18) {
        return next();
    } else {
        req.flash('error', "you must be above 18 to register");
        return res.redirect('/profiles/new');
    }
};

module.exports = middlewereObject;