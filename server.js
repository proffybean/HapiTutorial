var Hapi = require('hapi');
var uuid = require('uuid');

var server = new Hapi.Server();

var cards = {};

server.connection({port:3000});

server.ext('onRequest', function(req, reply){
	console.log('Request received: ' + req.path);
	reply.continue();
});

// homepage
server.route({
	  path: '/',
	method: 'GET',
   handler: {
	         file:'templates/index.html'
            }
});

// All the assets for the site
server.route({
	path: '/assets/{path*}',
	method: 'GET',
	handler: {
		directory:{
			path: './public',
			listing: true
		}
	}
});

server.route({
	path: '/cards/new',
	method: ['GET', 'POST'],
	handler: newCardHandler
});

server.route({
	path: '/cards',
	method:'GET',
	handler: cardsHandler
});

server.route({
	path: '/cards/{id}',
	method: 'DELETE',
	handler: deleteCardHandler
});

function cardsHandler(request, reply){
	reply.file('templates/cards.html');
}

function newCardHandler(request, reply){
	if (request.method == 'get'){
		reply.file('templates/new.html');	
	} else {
		var card = {
			name: request.payload.name,
			recipient_email: request.payload.recipient_email,
			sender_name: request.payload.sender_name,
			sender_email: request.payload.sender_email,
			card_image: request.payload.card_image
		};
		saveCard(card);
		console.log(cards);
		reply.redirect('/cards');
	}
} 

function saveCard(card){
	var id = uuid.v1();
	card.id = id;
	cards[id] = card;
}

function deleteCardHandler(request, reply){
	delete cards[request.params.id];	
}

server.start(function(){
	console.log('listening on ' + server.info.uri);
});