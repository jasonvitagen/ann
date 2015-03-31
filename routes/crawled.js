var express = require('express')
	, router = express.Router()
	, CrawledArticleModel = require('../models/mongo/CrawledArticle')
	, behaviors = require('./crawledRoutesBehaviors');

router.post('/filter-out-duplicate-article-links', function (req, res) {

	if (!req.body) {
		return res.json({
			err : 'No form data'
		});
	}
	if (!req.body.articleLinks) {
		return res.json({
			err : 'No article links in form data'
		});
	}

	behaviors.filterOutDuplicateArticleLinks({
		articleLinks : req.body.articleLinks
	}, function (err, articleLinks) {
		if (err) {
			res.json({
				err : err
			});
		}
		res.json({
			err : null,
			articleLinks : articleLinks
		})
	});
});

router.post('/get-crawled-articles', function (req, res) {
	
	if (!req.body) {
		return res.json({
			err : 'No form data'
		});
	}
	if (!req.body.articles) {
		return res.json({
			err : 'No articles in form data'
		});
	}

	behaviors.saveCrawledArticles({
		articles : req.body.articles
	}, function (err) {
		if (err) {
			return res.json({
				err : 'Error saving articles'
			});
		} else {
			return res.json({
				err : null
			});
		}
	});

});



module.exports = router;