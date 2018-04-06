const request = require('request');
const moment = require('moment');
const countryISO = require('countrynames');

const middlewereObject = {};


middlewereObject.MustBeLoggedIn = function MustBeLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};


middlewereObject.isAlreadyLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/profiles');
  }
  return next();
};

middlewereObject.MustHaveProfile = (req, res, next) => {
  if (!req.user.profile.id) {
    return res.redirect('/profiles/new');
  }
  return next();
};

middlewereObject.ValidateProfileLocation = (req, res, next) => {
  const url = `http://api.geonames.org/findNearbyPostalCodesJSON?postalcode=${req.body.postalcode}&country=${countryISO.getCode(req.body.country)}&maxRows=10&radius=30&username=balend`;
  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200 && !body.includes('status')) {
      return next();
    }
    req.flash('error', 'the postalcode or country you entered either do not match or do not exist');
    return res.redirect('/profiles/new');
  });
};

middlewereObject.ValidateProfileAge = (req, res, next) => {
  const formatedDate = moment(req.body.born).format('YYYY-MM-DD');
  const ageYears = moment().diff(moment(formatedDate, 'YYYY-MM-DD'), 'years');
  if (ageYears >= 18) {
    return next();
  }
  req.flash('error', 'you must be above 18 to register');
  return res.redirect('/profiles/new');
};

module.exports = middlewereObject;
