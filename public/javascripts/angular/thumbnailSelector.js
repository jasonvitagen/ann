angular
	.module('ann')
	.directive('thumbnailSelector', [function () {

		var ddo = {};

		ddo.require = 'ngModel';

		ddo.transclude = true;


		ddo.compile = function (element, attrs, transcludeFn) {

			return function (scope, element, attrs, ctrl) {

				var images = JSON.parse(attrs['options'])
					, items = [];

				for (var i = 0; i < images.length; i++) {
					var item = {};
					item.link = images[i];
					item.trackId = Date.now() + Math.round(Math.random() * 1000);
					items.push(item);
				}

				scope.items = items;

				var highlightThumbnail = function (value) {
					var imgs = element.find('img');
					imgs.removeClass('active');
					for (var i = 0; i < imgs.length; i++) {
						if (imgs.eq(i).attr('src') == value) {
							imgs.eq(i).addClass('active');
						}
					}
				}

				transcludeFn(scope, function (template) {
					element.append(template);
				});

				element.on('click', function (e) {

					highlightThumbnail(angular.element(e.target).attr('src'));					
					ctrl.$setViewValue(angular.element(e.target).attr('src'));

				});

			}
		}

		return ddo;

	}]);