var Handlers = require('./handlers');

var Routes = [{
		path: '/',
		method: 'GET',
		handler: {
			file:'templates/index.html'
		}
	},
	{
		path: '/assets/{path*}',
		method: 'GET',
		handler: {
			directory:{
				path: './public',
				listing: true
			}
		}
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
	}
];

module.exports = Routes;