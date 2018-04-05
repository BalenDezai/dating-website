var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    profile: {
        id: {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Profile'
        },
        firstname: String,
        postalcode: String,
        countrycode: String,
    },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);