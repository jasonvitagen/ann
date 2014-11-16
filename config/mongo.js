module.exports = {

	categoriesHierarchyDelimiter : ':',

	validators : {
		maxLength : function (maxLength) {
			return function (value) {
				return value && value.length <= maxLength;
			}
		}
	}

}