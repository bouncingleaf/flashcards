/**
 * The users controller file for final project
 * @author Jessica Roy
 */

/* jshint esversion: 6 */

const DB = require("./dbConnection.js");
const models = DB.getModels();

// Set up the users page
module.exports.users = (req, res, next) => {
  models.user.find({}, (err, users) => {
    if (err) error("could not find user " + userId, err);
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

// Set up the page for a single user
module.exports.user = (req, res, next) => {
  userUpdateDecks(req, res, next);
  let userId = req.params.userId;

  models.user.findById(userId, (err, user) => {
    if (err) error("could not select user " + userId, err);
    if (!user) return res.render("404");

    res.render("user", {
      title: "Decks for user " + user.name,
      userId: userId,
      data: user.userDecks.map(deck => {
        return {
          name: deck.name,
          day: deck.day,
          id: deck.deck,
          status: deck.active ? "Active" : "Inactive"
        };
      })
    });
  });
};

// Make sure the user has all the available decks to choose from
userUpdateDecks = (req, res, next) => {
  let userId = req.params.userId;

  models.user.findById(userId, (err, user) => {
    if (err) error("could not select user " + userId, err);
    if (!user) return res.render("404");
    const old = user.userDecks;
    const last =
      old & (old.length > 0) ? old.findIndex(old.length - 1).id : null;
    models.deck.find({ _id: { $gt: last } }, (err, newDecks) => {
      if (err) error("could not update user " + userId, err);
      else if (!newDecks || newDecks.length < 1)
        console.log("No update needed for " + userId);
      else {
        newDecks.forEach(deck => old.push(newUserDeck(deck)));
        user.save(err => {
          if (err) error("could not save user " + userId, err);
          else console.log(`User ${userId} has ${newDecks.length} new decks`);
        });
      }
    });
  });
};

// Add a new user
module.exports.saveNewUser = (req, res, next) => {
  models.deck.find({}, (err, allDecks) => {
    if (err || !allDecks) error("no decks defined", err);
    else {
      let user = new models.user({
        name: req.body.name,
        userDecks: allDecks.map(deck => newUserDeck(deck))
      });

      user.save(err => {
        if (err) error("could not save user " + userId, err);
        res.redirect("/users");
      });
    }
  });
};

// Activate or inactivate a deck for a given user
module.exports.toggleUserDeck = (req, res, next) => {
  let userId = req.body.userId;
  models.user.findById(userId, (err, user) => {
    if (err || !user) error("could not find user " + userId, err);
    else {
      let deckId = req.body.deckId;
      let match = user.userDecks.find(deck => {
        return deck.deck.toString() == deckId;
      });
      if (!match) error("could not find deck " + deckId);
      else {
        match.active = match.active ? false : true;
        if (match.active && match.levels.length === 0) {
          models.card.find({ deck: deckId }, (err, cards) => {
            if (err || !cards) error("could not set up deck " + deckId, err);
            else {
              let newCards = cards.map(card => card._id);
              match.levels = [{ level: 0, cards: newCards }];
              user.save(err => {
                if (err) error("could not save user " + userId, err);
                res.redirect("/user/" + userId);
              });
            }
          });
        }
      }
    }
  });
};

// "Sign in" currently meaning "choose the user to be"
module.exports.signIn = (req, res, next) => {
  let userName = req.body.name;

  models.user.findOne({ name: userName }, (err, user) => {
    if (err || !user) {
      error("could not find user " + userName, err);
      res.redirect("/home");
    } else {
      res.redirect("/user/" + user._id);
    }
  });
};

module.exports.practice = (req, res, next) => {
  let userId = req.body.userId;
  models.user.findById(userId, (err, user) => {
    if (err || !user) error("could not find user " + userId, err);
    else {
      let deckId = req.body.deckId;
      let match = user.userDecks.find(deck => {
        return deck.deck.toString() == deckId;
      });
      if (!match) error("could not find deck " + deckId);
      else {
        res.render("practice", {
          title: "Practicing " + match.name,
          userId: userId,
          data: match
        });
      }
    }
  });
};

newUserDeck = deck =>
  new models.userDeck({
    active: false,
    deck: deck._id,
    name: deck.name,
    levels: [],
    day: 0
  });

function error(msg, err) {
  console.log(`Error ${msg} : ${err}`);
}
