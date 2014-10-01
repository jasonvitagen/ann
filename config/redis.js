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
			list : {
				key : entityNames.articles + ':' + 'all' + ':' + 'list'	
			},
			set : {
				key : entityNames.articles + ':' + 'all' + ':' + 'set'
			}
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
					return entityNames.category + ':' + name + ':' + entityNames.articles;
				}
			}
		}
	}
}