var Hapi = require('hapi');
var uuid = require('uuid');
var fs = require('fs'); // for reading in the cards.json file
var Joi = require('joi');
var Boom = require('boom');

var server = new Hapi.Server();

var cards = loadCards();

server.connection({port:3000});

server.views({
	engines:{
		html: require('handlebars')
	},
	path: './templates'
});

server.ext('onRequest', function(req, reply){
	console.log('Request received: ' + req.path);
	reply.continue();
});

server.ext('onPreResponse', function(request, reply) {
	if (request.response.isBoom){
		return reply.view('error', request.response);
	}
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
	//reply.file('templates/cards.html');
	reply.view('cards', { cards: cards });
}

// The form data schema for validation:
var cardSchema = Joi.object().keys({
	name: Joi.string().min(3).max(50).required(),
	recipient_email: Joi.string().email().required(),
	sender_name: Joi.string().min(3).max(50).required(),
	sender_email: Joi.string().email().required(),
	card_image: Joi.string().regex(/.+\.(jpg|bmp|png|gif)\b/).required()
});

function newCardHandler(request, reply){
	if (request.method == 'get'){
		reply.view('new', { card_images: mapImages() }); // using the view engine instead of passing the file
	} else { // POST'ing a new card
		Joi.validate(request.payload, cardSchema, function(err, val) {
			// If theres an error, return 
			if (err){
				return reply(Boom.badRequest(err.details[0].message));
			}
			var card = {
				name: request.payload.name,
				recipient_email: val.recipient_email,
				sender_name: val.sender_name,
				sender_email: val.sender_email,
				card_image: val.card_image
			};
			saveCard(card);
			console.log(cards);
			reply.redirect('/cards');
		});
	}
} 

function saveCard(card){
	var id = uuid.v1();
	card.id = id;
	cards[id] = card;
}

function deleteCardHandler(request, reply){
	delete cards[request.params.id];
	reply(); // gives control back to the client, not sure why;
}

function loadCards(){
	var file = fs.readFileSync('./cards.json');
	return JSON.parse(file.toString());
}

function mapImages() {
	return fs.readdirSync('./public/images/cards');
}

server.start(function(){
	console.log('listening on ' + server.info.uri);
});