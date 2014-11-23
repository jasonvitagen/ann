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

		maxArticleContentLength       : 2000,

		validationMessages : {
			articleAuthorNameRequiredMsg  : 'Article Author Name Is Required',
			articleAuthorEmailRequiredMsg : 'Article Author Email Is Required',
			articleAuthorIdRequiredMsg    : 'Article Author Id Is Required',
			articleTitleRequiredMsg       : 'Article Title Is Required',
			articleThumbnailRequiredMsg   : 'Article Thumbnail Is Required',
			articleContentRequiredMsg     : 'Article Content Is Required',
			articleCategoryRequiredMsg    : 'Article Category Is Required',
			articleContentRequiredMsg     : 'Article Content Is Required',

			articleTitleLengthExceedsMsg  : 'Article Title Length Exceeds',
			articleThumbnailLengthExceeds : 'Article Thumbnail Length Exceeds',
			articleContentLengthExceeds   : 'Article Content Length Exceeds'
		},

		successMessage : 'Article has been created successfully',
		failedMessage : 'Failed to create article',

		redirections : {
			articleCreatedFailed : '/',
			articleCreatedSuccessful : '/'
		}

	},

	pagination : {

		myArticles : {
			startNumber : 0,
			size : 9
		},

		index : {
			startNumber : 0,
			size : 9
		},

		categoryArticles : {
			startNumber : 0,
			size : 9
		}

	},

	notificationMessages : {
		getMyArticlesFailed : "Something's wrong while retrieving your articles",
		articleNotFound : "Sorry we could not find that"
	}


}