//SCHEMA SETUP
const mongoose = require('mongoose')

var commentSchema = new mongoose.Schema({
    text: String,
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
})

//"Campgound" is the name of collection in db (would refer to plural like "Campgrounds")
// Refer Campground as a model
module.exports = mongoose.model("Comment", commentSchema)