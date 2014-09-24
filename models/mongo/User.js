// Dependencies
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// User Schema
var userSchema = mongoose.Schema({

	local: {              
		email       : String,
		password    : String,
		name        : String
	},            
	facebook: {   
		id          : String,
		token       : String,
		email       : String,
		name        : String
	},            
	twitter: {    
		id          : String,
		token       : String,
		displayName : String,
		username    : String
	},            
	google: {             
		id          : String,
		token       : String,
		email       : String,
		name        : String
	},
	role: String,
	rememberMeToken : String      

});

// Add Methods
// Hash password
userSchema.methods.hashPassword = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

// Check if password is valid
userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.local.password);
}

// Add Static Methods
userSchema.statics.hashPassword = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

module.exports = mongoose.model('User', userSchema);