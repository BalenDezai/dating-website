const   mongoose            = require('mongoose'),
        mongoosePaginate    = require('mongoose-paginate');
        
// schema setup
const profileSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    street: String,
    city: String,
    postalcode: String,
    country: String,
    countrycode: String,
    registered: Date,
    gender: String,
    age: Number,
    born: String,
    profileImage: String,
    description: String
});

profileSchema.plugin(mongoosePaginate);

//  compile into a model
module.exports = mongoose.model('Profile', profileSchema);