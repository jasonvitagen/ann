function PaginationLogic (args) {

	if (!args) {
		throw "No arguments passed to PaginationLogic";
		return;
	}

	var startNumber = args.startNumber || 0
		, size       = args.size || 10
		, startIndex = startNumber * size
		, endIndex   = startIndex + size - 1;

	this.startIndex = startIndex;
	this.size = size;

}

PaginationLogic.prototype.getStartIndex = function () {
	return this.startIndex;
}

PaginationLogic.prototype.getSize = function () {
	return this.size;
}

module.exports = PaginationLogic;