'use strict';


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

module.exports = middlewereObject;