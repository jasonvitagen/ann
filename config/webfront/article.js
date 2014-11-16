module.exports = {

	view : {

		relatedArticles : {
			sidebar : {
				amount : 10
			},
			prevAndNext : {
				amount : 2
			},
			bottom : {
				amount : 6
			}
		},

		beautifiedCreatedDateTimeFormat : 'D-M-YYYY'

	},

	save : {
		articleViewDefaultValue : 0,

		articleTitleAllowedLength     : 200,
		articleThumbnailAllowedLength : 500,
		articleContentAllowedLength   : 2000,

		articleTitleRequiredMsg       : 'Article Title Is Required',
		articleThumbnailRequiredMsg   : 'Article Thumbnail Is Required',
		articleContentRequiredMsg     : 'Article Content Is Required',

		articleTitleLengthExceedsMsg  : 'Article Title Length Exceeds',
		articleThumbnailLengthExceeds : 'Article Thumbnail Length Exceeds',
		articleContentLengthExceeds   : 'Article Content Length Exceeds',

		maxArticleContentLength       : 2000
	},


}