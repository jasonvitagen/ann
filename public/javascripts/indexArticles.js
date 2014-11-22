document.onreadystatechange = function () {

	if (document.readyState == 'interactive') {

		var number = 1,
			infiniteLoading = true;

		registerScrollTopListener(document.getElementById('article-list'), function (againstElementBottomPos, scrollTop) {

			if (infiniteLoading && 
				scrollTop > againstElementBottomPos) {

				infiniteLoading = false;

				ajaxGet('/more/' + number, {}, function (articles) {
					if (articles.length > 0) {
						number++;
						var moreHtml = getMoreIndexHtml(articles);
						appendMoreIndexHtml(document.getElementById('article-list'), moreHtml);

						setTimeout(function () {
							infiniteLoading = true;
						}, 500);
					}
				});
			}
			
		});

		
	}

}