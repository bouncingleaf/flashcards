/**
* The decks controller file for final project
* @author Jessica Roy
*/

/* jshint esversion: 6 */

const DB = require('./dbConnection.js');
const Deck = DB.getModels().deck;


module.exports.decks = (req, res, next) => {
  Deck.find({}, (err, decks) => {
    if (err)
      console.log("Error : %s ", err);

    let results = decks.map((deck) => {
      return {
        name: deck.name,
        id: deck._id,
      };
    });

    res.render('decks', { 
      title: "Decks", 
      data: results
    });
  });
};

module.exports.saveDeck = (req, res, next) => {
  
  let item = new Deck({
    name: req.body.name
  });

  item.save((err) => {
    if (err)
      console.log("Error : %s ", err);
    res.redirect('/decks');
  });
};
