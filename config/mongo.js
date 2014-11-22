module.exports = {

	categoriesHierarchyDelimiter : ':',

	validators : {
		maxLength : function (maxLength) {
			return function (value) {
				return value && value.length <= maxLength;
			}
		},
		validImagePath : function (value) {
			return !/^\/\/?/.test(value) && /^https?:\/\//.test(value);
		}
	}

}