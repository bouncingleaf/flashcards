/**
 * The cards controller file for final project
 * @author Jessica Roy
 */

/* jshint esversion: 6 */

const DB = require("./dbConnection.js");
const Deck = DB.getModels().deck;
const Card = DB.getModels().card;

/**
 * Admin screen for the cards belonging to a deck
 * You can add a card and view the cards already in the deck.
 */
module.exports.cards = (req, res, next) => {
  let deckId = req.params.deckId;
  // Get the deck, so we can display the name
  Deck.findById(deckId, (err, deck) => {
    if (err) error("could not identify deck", err);
    if (!deck) return res.render("404", {layout: 'adminMain'});
    // Get the cards for the deck
    Card.find({ deck: deckId }, (err, cards) => {
      if (err) error("could not select cards ", err);
      if (!cards) return res.render("404", {layout: 'adminMain'});
      let results = cards.map(card => {
        return {
          front: card.front,
          back: card.back,
          id: card._id
        };
      });
      // Display the page
      res.render("adminCards", {
        title: "Cards for deck: " + deck.name,
        deckId: deckId,
        data: results,
        layout: 'adminMain'
      });
    });
  });
};

// Save a new card
module.exports.saveCard = (req, res, next) => {
  let deckId = req.params.deckId;
  // Make and save the new card
  let item = new Card({
    deck: deckId,
    front: req.body.front,
    back: req.body.back
  });
  item.save(err => {
    if (err) error("could not save card", err);
    res.redirect("/adminCards/" + deckId);
  });
};

//TODO: Delete a card

function error(msg, err) {
  console.log(`Error ${msg} : ${err}`);
}
