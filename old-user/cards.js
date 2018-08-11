/**
* The cards controller file for final project
* @author Jessica Roy
*/

/* jshint esversion: 6 */

const DB = require('./dbConnection.js');
const Deck = DB.getModels().deck;
const Card = DB.getModels().card;

// Admin Screens

module.exports.cards = (req, res, next) => {
  let deckId = req.params.deckId;
  let deckName = null;

  Deck.findById(deckId, (err, deck) => {
    if (err) error("could not identify deck", err);
    if (!deck)
      return res.render('404');
    deckName = deck.name;
  });

  Card.find({deck: deckId}, (err, cards) => {    
    if (err) error("could not find cards ", err);
    if (!cards)
      return res.render('404');

      let results = cards.map((card) => {
      return {
        front: card.front,
        back: card.back,
        id: card._id
      };
    });

    res.render('cards', {
      title: "Cards for deck: " + deckName,
      deckId: deckId,
      data: results
    });
  });
};

module.exports.saveCard = (req, res, next) => {

  let deckId = req.params.deckId;
  
  // Make and save the new card
  let item = new Card({
    deck: deckId,
    front: req.body.front,
    back: req.body.back
  });
  
  item.save((err) => {
    if (err) error("could not save card", err);
    res.redirect('/cards/' + deckId);
  });
};

function error(msg, err) {
  console.log(`Error ${msg} : ${err}`);
}
