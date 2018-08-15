/**
 * The decks controller file for final project
 * @author Jessica Roy
 */

/* jshint esversion: 6 */

const DB = require("./dbConnection.js");
const Deck = DB.getModels().deck;

/**
 * A simple admin page for decks. One can view existing decks
 * and add a new deck... which is really just a name.
 */
module.exports.decks = (req, res, next) => {
  // Get all the decks
  Deck.find({}, (err, decks) => {
    if (err) error("unable to find decks", err);
    let results = decks.map(deck => {
      return {
        name: deck.name,
        id: deck._id
      };
    });
    res.render("adminDecks", {
      title: "Decks",
      data: results,
      layout: 'adminMain'
    });
  });
};

// Saves a new deck.
module.exports.saveDeck = (req, res, next) => {
  let item = new Deck({
    name: req.body.name
  });
  item.save(err => {
    if (err) error("unable to save deck ", err);
    res.redirect("/adminDecks");
  });
};

function error(msg, err) {
  console.log(`Error ${msg} : ${err}`);
}
