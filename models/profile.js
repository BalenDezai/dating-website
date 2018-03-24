var mongoose = require('mongoose');

// schema setup
var profileSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    registered: Date,
    gender: String,
    age: Number,
    born: String,
    profileImage: String,
    description: String
});

//  compile into a model
module.exports = mongoose.model('Profile', profileSchema);