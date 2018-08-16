/**
 * The cards controller file for final project
 * @author Jessica Roy
 */

/* jshint esversion: 6 */

const DB = require("./dbConnection.js");
const Deck = DB.getModels().deck;
const Card = DB.getModels().card;

// See https://www.npmjs.com/package/dompurify
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);
 
/**
 * Admin screen for the cards belonging to a deck
 * You can add a card and view the cards already in the deck.
 */
module.exports.cards = (req, res, next) => {
  const deckId = DOMPurify.sanitize(req.params.deckId);
  // Get the deck, so we can display the name
  Deck.findById(deckId, (err, deck) => {
    if (err) error("could not identify deck", err);
    if (!deck) return res.render("404", {layout: 'adminMain'});
    // Get the cards for the deck
    Card.find({ deck: deckId }, (err, cards) => {
      if (err) error("could not select cards ", err);
      if (!cards) return res.render("404", {layout: 'adminMain'});
      const results = cards.map(card => {
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
  const deckId = DOMPurify.sanitize(req.params.deckId);
  // Make and save the new card
  const item = new Card({
    deck: deckId,
    front: DOMPurify.sanitize(req.body.front),
    back: DOMPurify.sanitize(req.body.back)
  });
  item.save(err => {
    if (err) error("could not save card", err);
    res.redirect(303, "/adminCards/" + deckId);
  });
};

module.exports.editOrDeleteCard = (req, res, next) => {
  const deckId = DOMPurify.sanitize(req.params.deckId);
  const cardId = DOMPurify.sanitize(req.params.cardId);
  Card.findById(cardId, (err, card) => {
    if (err) error("could not find card", err);
    res.render("adminEditCard", {
      title: "Edit/Delete card",
      front: card.front,
      back: card.back,
      cardId: card._id,
      deckId: deckId,
      layout: 'adminMain'
    });
  });
};

module.exports.saveCardEdit = (req, res, next) => {
  const deckId = DOMPurify.sanitize(req.params.deckId);
  const cardId = DOMPurify.sanitize(req.params.cardId);
  const front = DOMPurify.sanitize(req.body.front);
  const back = DOMPurify.sanitize(req.body.back);

  Card.findById(cardId, (err, card) => {
    card.front = front;
    card.back = back;
    card.save(err => {
      if (err) error("could not save card", err);
      res.redirect(303, "/adminCards/" + deckId);
    });
  });
};

module.exports.saveCardDelete = (req, res, next) => {
  const deckId = DOMPurify.sanitize(req.params.deckId);
  const cardId = DOMPurify.sanitize(req.params.cardId);

  Card.findOneAndDelete({_id: cardId}, (err, card) => {
    if (err) error("could not delete card", err);
    res.redirect(303, "/adminCards/" + deckId);
  });
}

function error(msg, err) {
  console.log(`Error ${msg} : ${err}`);
}
