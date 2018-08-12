/**
 * The dbConnection file
 * @author Jessica Roy
 */

/* jshint esversion: 6 */

const mongoose = require("mongoose");
const dbUrl = process.env.MONGODB_URI;

let connection = null;
let models = null;

const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const CardSchema = new Schema({
  // TODO: cardFront and cardBack should accept non-strings
  deck: Schema.Types.ObjectId, // Deck the card beongs to
  front: String, // "gato"
  back: String // "cat"
});

const DeckSchema = new Schema({
  name: String // "Spanish vocabulary"
});

const MyCardSchema = new Schema({
  card: Schema.Types.ObjectId, // The card in a userDeck
  level: Number // The level, 0-8
});

const UserDeckSchema = new Schema({
  deck: Schema.Types.ObjectId, // The deck the user is studying
  name: String, // Name of the deck
  active: Boolean, // Is deck active for user
  myCards: [MyCardSchema], // The cards in this practice deck
  day: Number, // What day the user is on
  lastPracticedOn: Date // When the user last practiced
});

const UserSchema = new Schema({
  name: String, // "jdoe"
  userDecks: [UserDeckSchema] // Embedded subdocument
});

module.exports.getModels = () => {
  if (connection == null) {
    connection = mongoose.createConnection(dbUrl, { useNewUrlParser: true });
    models = {
      card: connection.model("Card", CardSchema),
      deck: connection.model("Deck", DeckSchema),
      user: connection.model("User", UserSchema),
      userDeck: connection.model("UserDeck", UserDeckSchema),
      myCard: connection.model("MyCard", MyCardSchema)
    };
  }
  return models;
};
