/**
 * The dbConnection file 
 * @author Jessica Roy
 */

 /* jshint esversion: 6 */

const mongoose = require('mongoose');
const dbUrl = process.env.MONGODB_URI;

let connection = null;
let models = null;

const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const CardSchema = new Schema({
  // TODO: cardFront and cardBack should accept non-strings
  deck: Schema.Types.ObjectId,            // Deck the card beongs to
  front: String,                          // "gato"
  back: String                            // "cat"
});

const DeckSchema = new Schema({
  name: String,                           // "Spanish vocabulary" 
});

const UserSchema = new Schema({
  name: String,                           // "jdoe"
});

const MyDeckSchema = new Schema({
  user: Schema.Types.ObjectId,            // The user who is studying this deck
  deck: Schema.Types.ObjectId,            // The deck the user is studying
  levels: [{                              // Card groupings
    level: Number,                           // level = 0-8
    cards: [Schema.Types.ObjectId]           // cards at this level
  }],
  day: Number                             // What day the user is on, e.g. "3"
})

module.exports.getModels = 
	() => {
		if (connection == null) {
      connection = mongoose.createConnection(dbUrl, { useNewUrlParser: true });
      models = { 
			  card: connection.model("Card",	CardSchema),
        deck: connection.model("Deck", DeckSchema),
			  user: connection.model("User",	UserSchema),
        myDeck: connection.model("MyDeck",	MyDeckSchema)
      };
    }
		return models;
	};
