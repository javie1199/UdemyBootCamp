//SCHEMA SETUP
const mongoose = require('mongoose')

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
	description: String,
	comments:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}],
	author: {
        _id:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username : String
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },

    location: String
})

//"Campgound" is the name of collection in db (would refer to plural like "Campgrounds")
// Refer Campground as a model
module.exports = mongoose.model("Campground", campgroundSchema)