var uuid = require('uuid');
var fs = require('fs'); // for reading in the cards.json file
var Joi = require('joi');
var Boom = require('boom');
var CardStore = require('./cardStore');

var Handlers = {};

// The form data schema for validation:
var cardSchema = Joi.object().keys({
	name: Joi.string().min(3).max(50).required(),
	recipient_email: Joi.string().email().required(),
	sender_name: Joi.string().min(3).max(50).required(),
	sender_email: Joi.string().email().required(),
	card_image: Joi.string().regex(/.+\.(jpg|bmp|png|gif)\b/).required()
});

Handlers.newCardHandler = function(request, reply){
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
			console.log(CardStore.cards);
			reply.redirect('/cards');
		});
	}
} 

Handlers.cardsHandler = function(request, reply){
	//reply.file('templates/cards.html');
	reply.view('cards', { cards: CardStore.cards });
}

Handlers.deleteCardHandler = function(request, reply){
	delete CardStore.cards[request.params.id];
	reply(); // gives control back to the client, not sure why;
}

function saveCard(card) {
	var id = uuid.v1();
	card.id = id;
	CardStore.cards[id] = card;
}

function mapImages() {
	return fs.readdirSync('./public/images/cards');
}

module.exports = Handlers;