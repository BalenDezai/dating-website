'use strict';

var middlewereObject = {};

middlewereObject.isLoggedIn = function isLoggedIn(req,res,next){
    
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};


middlewereObject.isAlreadyLoggedIn = function isAlreadyLoggedIn(req, res, next){
    
    if(req.isAuthenticated()){
        //  TODO: ERROR HANDLE BETTER
        return res.redirect("/profiles");
    } else {
        return next();
    }
};

module.exports = middlewereObject;