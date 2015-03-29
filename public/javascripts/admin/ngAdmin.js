angular
	.module('ngAdmin', [])
	.constant('updateCategoryCacheUrl', './update-category-cache')
	.constant('trimCachedArticlesInPoolUrl', './trim-cached-articles-in-pool')
	.factory('adminService', ['$http', 'updateCategoryCacheUrl', 'trimCachedArticlesInPoolUrl', function ($http, updateCategoryCacheUrl, trimCachedArticlesInPoolUrl) {

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
			$scope.status.trimCachedArticlesInPool = 'Updating...';
			if (!args) {
				return $scope.status.trimCachedArticlesInPool = 'No args';
			}
			if (!args.key) {
				return $scope.status.trimCachedArticlesInPool = 'No "key" arg';
			}
			if (!args.size) {
				return $scope.status.trimCachedArticlesInPool = 'No "size" arg';
			}

			adminService.trimCachedArticlesInPool(args, function (response) {
				$scope.status.trimCachedArticlesInPool = response.status;
				$timeout(function () {
					$scope.status = {};
				}, 3000);
			});

		}

	}]);