var mongoose = require("mongoose")

// schema setup
var profileSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    gender: String,
    born: Date,
    profileImage: String,
    description: String,
    owner: {
        id: {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String  
        
    },
});

//  compile into a model
module.exports = mongoose.model("Profile", profileSchema);