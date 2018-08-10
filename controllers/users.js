/**
 * The users controller file for final project
 * @author Jessica Roy
 */

/* jshint esversion: 6 */

const DB = require("./dbConnection.js");
const models = DB.getModels();

module.exports.users = (req, res, next) => {
  models.user.find({}, (err, users) => {
    if (err) console.log("Error : %s ", err);
    let results = users.map(user => {
      return {
        name: user.name,
        id: user._id
      };
    });

    res.render("users", {
      title: "Users",
      data: results
    });
  });
};

// Get data for a page for a single user
module.exports.user = (req, res, next) => {
  let userId = req.params.userId;
  let results = {
    userName: getUserName(userId),
    userDecks: getUserDecks(userId)
  };
  results.decks = getUserDeckOptions(results.userDecks.map(deck => deck.id));

  // Go the user detail page
  res.render("user", {
    title: "Decks for user: " + results.userName,
    data: results
  });
};

function getUserName(userId) {
  return models.user.findById(userId, (err, user) => {
    if (err) console.log("Error identifying user: %s", err);
    if (!user) return null;
    return user.name;
  });
}

function getUserDecks(userId) {
  // Get the user's selected decks
  return models.userDeck.find({ user: userId }, (err, userDecks) => {
    if (err) console.log("Error Selecting : %s ", err);
    if (!userDecks) return [];
    return userDecks.map(userDeck => {
      return {
        name: userDeck.name,
        id: userDeck._id
      };
    });
  });
}

// Get the available decks the user hasn't selected
function getUserDeckOptions(userDecks) {
  return models.deck.find({}, (err, decks) => {
      if (err) console.log("Error loading decks: %s ", err);
      if (!decks) return [];
      return decks.map(deck => {
        return {
          name: deck.name,
          id: deck._id
        };
      });
    }).where("_id").nin(userDecks);
}

// Add a new user
module.exports.saveUser = (req, res, next) => {
  let item = new models.user({
    name: req.body.name
  });

  item.save(err => {
    if (err) console.log("Error : %s ", err);
    res.redirect("/users");
  });
};

// Add a new deck for a user
module.exports.saveUserDeck = (req, res, next) => {
  const deckId = req.body.deckId;

  let item = new models.userDeck({
    user: userId,
    deck: deckId,
    levels: setupNewUserDeck(deckId),
    day: 0
  });

  item.save(err => {
    if (err) console.log("Error : %s ", err);
    res.redirect("/user");
  });
};

// Set up the array to track progress for a user
function setupNewUserDeck(deckId) {
  const newCards = Card.find({ deck: deckId }, (err, cards) => {
    if (err || !cards) return [];
    return cards.map(card => card._id);
  });

  return [{ level: 0, cards: newCards }];
}
