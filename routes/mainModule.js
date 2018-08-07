/**
* The mainModule file for final project
* @author Jessica Roy
*/

/* jshint esversion: 6 */

const DB = require('./dbConnection.js');
const models = DB.getModels();


// User screens

module.exports.home = (req, res, next) => {
  res.render('home', { title: "Home" });
};

module.exports.privacy = (req, res, next) => {
  res.render('privacy', { title: "Privacy" });
};

// Admin Screens

module.exports.cards = (req, res, next) => {
  let deckID = req.params.deckID;
  let deckName = null;

  models.deck.findById(deckID, (err, deck) => {
    if (err)
      console.log("Error identifying deck: %s", err);
    if (!deck)
      return res.render('404');
    deckName = deck.name;
  });

  models.card.find({deck: deckID}, (err, cards) => {
    if (err)
      console.log("Error Selecting : %s ", err);
    if (!cards)
      return res.render('404');

      let results = cards.map((card) => {
      return {
        front: card.front,
        back: card.back,
        id: card._id
      };
    });

    res.render('/cards/' + deckID, {
      title: "Cards for " + deckName,
      deckID: deckID,
      data: results,
      layout: 'admin'
    });
  });
};

module.exports.decks = (req, res, next) => {
  models.deck.find({}, (err, decks) => {
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
      data: results,
      layout: 'admin'
    });
  });
};

module.exports.users = (req, res, next) => {
  models.user.find({}, (err, users) => {
    if (err)
      console.log("Error : %s ", err);
    let results = users.map((user) => {
      return {
        name: user.name,
        id: user._id,
      };
    });

    res.render('users', {
      title: "Users",
      data: results,
      layout: 'admin'
    });
  });
};

module.exports.saveCard = (req, res, next) => {

  let deckID = req.params.deckID;
  
  // Make and save the new card
  let item = new models.card({
    deck: deckID,
    front: req.body.front,
    back: req.body.last
  });
  
  item.save((err) => {
    if (err)
      console.log("Error : %s ", err);
    res.render('/cards/' + deckID);
  });
};

module.exports.saveDeck = (req, res, next) => {
  
  let item = new models.deck({
    name: req.body.name
  });

  item.save((err) => {
    if (err)
      console.log("Error : %s ", err);
    res.redirect('/decks');
  });
};

module.exports.saveUser = (req, res, next) => {
  
  let item = new models.user({
    name: req.body.name
  });
  
  item.save((err) => {
    if (err)
      console.log("Error : %s ", err);
    res.redirect('/users');
  });
  
};
