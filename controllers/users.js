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

module.exports.userUpdateDecks = (req, res, next) => {
  let userId = req.params.userId;

  models.user.findById(userId, (err, user) => {
    if (err) console.log("Error Selecting : %s ", err);
    if (!user) return res.render("404");
    const lastDeck = user.userDecks.findIndex(user.userDecks.length - 1);
    models.deck.find({_id: { $gt: lastDeck.id }}, (err, newDecks) => {
      if (err) console.log("Could not update user: %s", err);
      if (!newDecks) console.log("No update needed for user " + user);
      newDecks.foreach(newDeck => user.userDecks.push(
        new models.userDeck({
          active: false,
          deck: newDeck._id,
          levels: [],
          day: 0
          })
        ));
      user.save(err => {
        if (err) console.log("Error : %s ", err);
        res.redirect("/user/" + userId);
      });
    });
  });
};

// Get data for a page for a single user
module.exports.user = (req, res, next) => {
  let userId = req.params.userId;

  models.user.findById(userId, (err, user) => {
    if (err) console.log("Error Selecting : %s ", err);
    if (!user) return res.render("404");

    let results = user.userDecks
      ? user.userDecks.map(userDeck => {
          models.deck.findById(userDeck.deck, (err, deck) => {
            if (err || !deck) console.log("Error looking up deck: %s ", err);
            return {
              id: userDeck.deck,
              name: deck.name,
              levels: userDeck.levels,
              day: userDeck.day
            };
          });
        })
      : [];

    res.render("user", {
      title: "Decks for user: " + user.name,
      userId: userId,
      userName: user.name,
      data: results,
      allDecks: decks
    });
  });
};

// Add a new user
module.exports.saveNewUser = (req, res, next) => {
  models.deck.find({}, (err, allDecks) => {
    if (err || !allDecks) console.log("No decks defined: %s ", err);
    else {
      let userDecks = allDecks.map(
        (deck) => new models.userDeck({
          active: false,
          deck: deck._id,
          levels: [],
          day: 0
          })
        );
      let item = new models.user({
        name: req.body.name,
        userDecks: userDecks
      });

      item.save(err => {
        if (err) console.log("Error : %s ", err);
        res.redirect("/users");
      });
    }
  });
};

module.exports.toggleDeck = (req, res, next) => {
  let deckToActivate = req.body.deckId;
  let userId = req.body.userId;
  models.user.findById(userId, (err, user) => {
    if (err || !user) console.log("Could not find user: %s ", err);
    let matchingDeck = user.userDecks.find(deck => deck.id === deckToActivate);
    if (!matchingDeck) console.log("Could not find deck: %s ", err);
    matchingDeck.active = matchingDeck.active ? false : true;
    user.save(err => {
      if (err) console.log("Error: %s", err);
      res.redirect("/user/" + userId);
    })
  });
};

// // Add a new deck for a user
// module.exports.saveUserDeck = (req, res, next) => {
//   const deckId = req.body.deckId;

//   let item = new models.userDeck({
//     user: userId,
//     deck: deckId,
//     levels: setupNewUserDeck(deckId),
//     day: 0
//   });

//   item.save(err => {
//     if (err) console.log("Error : %s ", err);
//     res.redirect("/user");
//   });
// };

// Set up the array to track progress for a user
function setupNewUserDeck(deckId) {
  const newCards = Card.find({ deck: deckId }, (err, cards) => {
    if (err || !cards) return [];
    return cards.map(card => card._id);
  });

  return [{ level: 0, cards: newCards }];
}
