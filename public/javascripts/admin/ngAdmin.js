angular
	.module('ngAdmin', [])
	.constant('updateCategoryCacheUrl', './update-category-cache')
	.constant('trimCachedArticlesInPoolUrl', './trim-cached-articles-in-pool')
	.constant('crawledArticlesUrl', './list-crawled-articles-json')
	.constant('archivedCrawledArticlesUrl', './list-archived-crawled-articles-json')
	.constant('deleteCrawledArticleUrl', './delete-crawled-article')
	.factory('adminService', ['$http', 'updateCategoryCacheUrl', 'trimCachedArticlesInPoolUrl', 'crawledArticlesUrl', 'deleteCrawledArticleUrl', 'archivedCrawledArticlesUrl', function ($http, updateCategoryCacheUrl, trimCachedArticlesInPoolUrl, crawledArticlesUrl, deleteCrawledArticleUrl, archivedCrawledArticlesUrl) {

		var apis = {};

		apis.updateCategoryCache = function (callback) {

			$http
				.post(updateCategoryCacheUrl)
				.success(function (response) {
					callback(response);
				});

		}

		apis.trimCachedArticlesInPool = function (args, callback) {
			if (!args) {
				return console.log('No args');
			}
			if (!args.key) {
				return console.log('No "key" arg');
			}
			if (!args.size) {
				return console.log('No "size" arg');
			}
			$http
				.post(trimCachedArticlesInPoolUrl, args)
				.success(function (response) {
					callback(response);
				});
		}

		apis.getCrawledArticles = function (args, callback) {
			$http
				.get(crawledArticlesUrl)
				.success(function (response) {
					callback(null, response.data);
				});
		}

		apis.getArchivedCrawledArticles = function (args, callback) {
			$http
				.get(archivedCrawledArticlesUrl)
				.success(function (response) {
					callback(null, response.data);
				});
		}

		apis.deleteCrawledArticle = function (args, callback) {
			if (!args) {
				return callback('No args');
			}
			if (!args.articleId) {
				return callback('No "articleId" arg');
			}

			$http
				.post(deleteCrawledArticleUrl, { articleId : args.articleId })
				.success(function (response) {
					callback(null, response);
				});
		}

		return apis;

	}])
	.controller('adminCtrl', ['$scope', 'adminService', '$timeout', function ($scope, adminService, $timeout) {

		$scope.status = {};

		$scope.updateCategoryCache = function () {
			$scope.status.updateCategoryCache = 'Updating...';
			adminService.updateCategoryCache(function (response) {
				$scope.status.updateCategoryCache = response.status;
				$timeout(function () {
					$scope.status = {};
				}, 3000);	
			});
		}

		$scope.trimCachedArticlesInPool = function (args) {
			
			if (!args) {
				return $scope.status.trimCachedArticlesInPool = 'No args';
			}
			if (!args.key) {
				return $scope.status.trimCachedArticlesInPool = 'No "key" arg';
			}
			if (!args.size) {
				return $scope.status.trimCachedArticlesInPool = 'No "size" arg';
			}

			$scope.status.trimCachedArticlesInPool = 'Updating...';

			adminService.trimCachedArticlesInPool(args, function (response) {
				$scope.status.trimCachedArticlesInPool = response.status;
				$timeout(function () {
					$scope.status = {};
				}, 3000);
			});

		}

		$scope.getCrawledArticles = function () {
			$scope.status.getCrawledArticles = 'Updating...';
			adminService.getCrawledArticles({}, function (err, response) {
				$scope.crawledArticles = response;
				$timeout(function () {
					$scope.status = {};
				}, 3000);
			});

		}

		$scope.getArchivedCrawledArticles = function () {
			$scope.status.getArchivedCrawledArticles = 'Updating...';
			adminService.getArchivedCrawledArticles({}, function (err, response) {
				$scope.archivedCrawledArticles = response;
				$timeout(function () {
					$scope.status = {};
				}, 3000);
			});

		}

		$scope.deleteCrawledArticle = function (args) {

			if (!args) {
				return console.log('No args');
			}
			if (!args.articleId) {
				return console.log('No "articleId" arg');
			}
			if (args.index == undefined) {
				return console.log('No "index" arg');
			}

			$scope.status.deleteCrawledArticle = 'Deleting...';

			adminService.deleteCrawledArticle({
				articleId : args.articleId
			}, function (err, response) {
				if (err) {
					return $scope.status.deleteCrawledArticle = err;
				}
				if (response) {
					$scope.crawledArticles.splice(args.index, 1);
				}
				$scope.status.deleteCrawledArticle = response.status;
				$timeout(function () {
					$scope.status = {};
				}, 3000);
			});

		}

		$scope.refreshAllCrawledArticles = function () {
			$scope.getCrawledArticles();
			$scope.getArchivedCrawledArticles();
		}

	}]);