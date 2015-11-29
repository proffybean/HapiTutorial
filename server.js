var Hapi = require('hapi');
var CardStore = require('./lib/cardStore');

var server = new Hapi.Server();

CardStore.initialize();

server.connection({port:3000});

server.views({
	engines:{
		html: require('handlebars')
	},
	path: './templates'
});

// After installing good and good-file, we no longer need to log requests
//server.ext('onRequest', function(req, reply){
//	console.log('Request received: ' + req.path);
//	reply.continue();
//});

// Setup good logging
server.register({
	register: require('good'),
	options: {
		opsInterval: 5000,
		reporters: [
			{
				reporter: require('good-file'),
				events: { ops: '*' },
				config: {
					path: './logs',
					prefix: 'hapi-process',
					rotate: 'daily'
				}
			},
			{
				reporter: require('good-file'),
				events: { response: '*'},
				config: {
					path: './logs',
					prefix: 'hapi-requests',
					rotate: 'daily'
				}
			},
			{
				reporter: require('good-file'),
				events: { error: '*'},
				config: {
					path: './logs',
					prefix: 'hapi-error',
					rotate: 'daily'
				}
			}
		]
	}
}, function(err) {
	console.log('Error: ' + err);	
});

server.ext('onPreResponse', function(request, reply) {
	if (request.response.isBoom){
		return reply.view('error', request.response);
	}
	reply.continue();
});

server.route(require('./lib/routes'));

server.start(function(){
	console.log('listening on ' + server.info.uri);
});