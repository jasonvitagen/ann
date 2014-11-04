var mongoose = require('mongoose');

var categorySchema = mongoose.Schema({

	name : String,
	url  : String

});

categorySchema.methods.buildUrl = function (categoryName) {

}

module.exports = {
	schema : categorySchema,
	model  : mongoose.model('Category', categorySchema)
}