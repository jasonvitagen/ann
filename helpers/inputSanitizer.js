var sanitizer = {};

sanitizer.scriptTagsRemove = function (input) {
	input = input.replace('<script>', '');
	input = input.replace('</script>', '');
	input = input.replace('javascript', '');
	return input;
}

module.exports = sanitizer;