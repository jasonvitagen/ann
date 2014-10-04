(function () {
	'use strict';


	function ajaxGet (url, callback) {
		if (XMLHttpRequest) {
			var httpRequest = new XMLHttpRequest();
			httpRequest.onreadystatechange = function () {
				httpRequest.readyState == 4 &&
				httpRequest.status == 200 &&
				callback(JSON.parse(httpRequest.response));
			}
			httpRequest.open('GET', url);
			httpRequest.send();
		}
	}


	function getSidebarHtml (articles) {
		var html = '';
		html += '<ul class="ul-reset">';
		for (var i = 0; i < articles.length; i++) {
			var article = articles[i];
			console.log(article);
			html += '<li class="bottom-margin-16">' +
						'<div class="item"' +
						 	'<div class="thumbnail">' +
						 		'<a href="/article/' +
						 			article.id +
						 			'/' +
						 			article.title +
						 		'">' +
						 			'<img src="' +
						 				article.thumbnail +
						 			'" alt="">' +
						 			'</a>' +
						 	'</div>' +
						 	'<div class="item-title">' +
						 		'<a href="/article/' +
						 			article.id +
						 			'/' +
						 			article.title +
						 		'">' +
						 			'<h2>' +
						 				article.title +
						 			'</h2>' +
						 		'</a>' +
						 	'</div>' +
						'</div>' +
					'</li>';
		}
		html += '</ul>';
		return html;
	}


	function removeElementInList (list, property, condition) {
		console.log('sfd', list);
		for (var i = 0; i < list.length; i++) {
			var element = list[i];
			if (element[property] == condition) {
				list.splice(i, 1);
				break;
			}
		}
	}


	window.ajaxGet = ajaxGet;
	window.getSidebarHtml = getSidebarHtml;
	window.removeElementInList = removeElementInList;

})();