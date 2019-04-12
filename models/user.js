var mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	isAdmin:{
		type: Boolean,
		default: false
	},
	avatar: String,
    firstName: String,
    lastName: String,
    email: String,
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)