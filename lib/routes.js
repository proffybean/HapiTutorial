var Handlers = require('./handlers');

var Routes = [{
		path: '/',
		method: 'GET',
		handler: {
			file:'templates/index.html'
		},
		config: { auth:false }
	},
	{
		path: '/assets/{path*}',
		method: 'GET',
		handler: {
			directory:{
				path: './public',
				listing: true
			}
		},
		config: { auth:false }
	},
	{
		path: '/cards/new',
		method: ['GET', 'POST'],
		handler: Handlers.newCardHandler
	},
	{
		path: '/cards',
		method:'GET',
		handler: Handlers.cardsHandler
	},
	{
		path: '/cards/{id}',
		method: 'DELETE',
		handler: Handlers.deleteCardHandler
	},
	{
		path: '/login',
		method: 'GET',
		handler: { file: 'templates/login.html'},
		config: { auth:false }
	}
];

module.exports = Routes;