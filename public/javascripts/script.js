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
		html += '<ul>';
		for (var i = 0; i < articles.length; i++) {
			var article = articles[i];
			console.log(article);
			html += '<li class="bottom-margin-16">' +
					 	'<div class="thumbnail">' +
					 		'<a href="/article/' +
					 			article.id +
					 		'">' +
					 			'<img src="' +
					 				article.thumbnail +
					 			'" alt="">' +
					 			'</a>' +
					 	'</div>' +
					 	'<div class="item-title">' +
					 		'<a href="/article/' +
					 			article.id +
					 		'">' +
					 			'<h2>' +
					 				article.title +
					 			'</h2>' +
					 		'</a>' +
					 	'</div>' +
					'</li>';
		}
		html += '</ul>';
		return html;
	}


	window.ajaxGet = ajaxGet;
	window.getSidebarHtml = getSidebarHtml;

})();