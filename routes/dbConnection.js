/**
 * The dbConnection file 
 * @author Jessica Roy
 * Based on code provided in class by Suresh Kalathur
 */

 /* jshint esversion: 6 */

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const dbUrl = process.env.MONGODB_URI;

let connection = null;
let model = null;

const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const DeckSchema = new Schema({
  deckName: String,    // "Spanish vocabulary" 
  deckCardIDs: [ObjectId]   // The card IDs that [7,22,23,38,41,47,56...]
});

const CardSchema = new Schema({
  // TODO: cardFront and cardBack should accept non-strings
  cardFront: String,   // "gato"
  cardBack: String     // "cat"
});

const UserSchema = new Schema({
  userName: String,    // "jdoe"
  myDecks: [ObjectId]       // "13,47,50"
});

/**
 * 0 = not yet seen cards
 * 1 = daily
 * 2 = every other day
 * 3 = every 4 days
 * 4 = every 8 days
 * 5 = every 16 days
 * 6 = every 32 days
 * 7 = every 64 days
 * 8 = is retired - the user is done with this card
 * 
 * Each day we pull any new card IDs from the main deck into the user deck.
 * New cards are added at level 0 (there may already be cards there).
 * Then we move N (say, 20) cards from 0 into 1
 * Then we start prompting the user with the highest level cards they are due
 * to review that day. 
 * If they get the card right, it advances a level. If they don't, it goes
 * down a level.
 */
 
const MyDeckSchema = new Schema({
  userID: ObjectId,      // "8"
  deckID: ObjectId,      // "47"
  myDeckLevels: [Number][ObjectId], // See above
  myDeckDay: Number    // What practice day the user is on, e.g. "3"
})

module.exports.getModels = 
	() => {
		if (connection == null) {
      connection = mongoose.createConnection(dbUrl, { useNewUrlParser: true });
      models = { 
        deck: connection.model("Deck", DeckSchema),
			  card: connection.model("Card",	CardSchema),
			  user: connection.model("User",	UserSchema),
        myDeck: connection.model("MyDeck",	MyDeckSchema)
      }
		}
		return models;
	};
