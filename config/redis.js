var entityNames = {
	article : 'article',
	articles : 'articles',
	user : 'user',
	users : 'users',
	category : 'category',
	categories : 'categories'
}

module.exports = {
	keyNames : {
		global : {
			article : {
				key : 'global:' + entityNames.article + 'Id',
				value : '10000'
			}
		},
		article : {
			getId : function (id) {
				return entityNames.article + ':' + id;
			}
		},
		articles : {
			key : entityNames.articles + ':' + 'all'
		},
		user : {
			articles : {
				getId : function (id) {
					return entityNames.user + ':' + id + ':' + entityNames.articles;
				}
			}
		},
		category : {
			articles : {
				getId : function (name) {
					console.log(name);
					return entityNames.category + ':' + name + ':' + entityNames.articles;
				}
			}
		}
	}
}