/**
* The main controller file for final project
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
  let deckId = req.params.deckId;
  let deckName = null;

  models.deck.findById(deckId, (err, deck) => {
    if (err)
      console.log("Error identifying deck: %s", err);
    if (!deck)
      return res.render('404');
    deckName = deck.name;
  });

  models.card.find({deck: deckId}, (err, cards) => {    
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

    res.render('cards', {
      title: "Cards for deck: " + deckName,
      deckId: deckId,
      data: results
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
      data: results
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
      data: results
    });
  });
};

module.exports.user = (req, res, next) => {
  let userId = req.params.userId;
  let userName = null;

  models.user.findById(userId, (err, user) => {
    if (err)
      console.log("Error identifying user: %s", err);
    if (!user)
      return res.render('404');
    userName = user.name;
  });

  models.myDeck.find({user: userId}, (err, myDecks) => {    
    if (err)
      console.log("Error Selecting : %s ", err);
    if (!myDecks)
      return res.render('404');

      let results = myDecks.map((myDeck) => {
      return {
        name: myDeck.name,
        id: myDeck._id
      };
    });

    res.render('user', {
      title: "Decks for user: " + userName,
      userId: userId,
      userName: userName,
      data: results
    });
  });
};

module.exports.saveCard = (req, res, next) => {

  let deckId = req.params.deckId;
  
  // Make and save the new card
  let item = new models.card({
    deck: deckId,
    front: req.body.front,
    back: req.body.back
  });
  
  item.save((err) => {
    if (err)
      console.log("Error : %s ", err);
    res.redirect('/cards/' + deckId);
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

module.exports.saveMyDeck = (req, res, next) => {
  
  let item = new models.myDeck({
    name: req.body.name
  });
  
  item.save((err) => {
    if (err)
      console.log("Error : %s ", err);
    res.redirect('/user');
  });
  
};
