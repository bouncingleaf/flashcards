/**
 * The users controller file for final project
 * @author Jessica Roy
 */

/* jshint esversion: 6 */

const DB = require("./dbConnection.js");
const models = DB.getModels();

/**
 * This is the admin page for users - one can add new users here,
 * or link to managing an individual user.
 */
module.exports.users = (req, res, next) => {
  // Get all the users
  models.user.find({}, (err, users) => {
    if (err) error("could not find users ", err);
    let results = users.map(user => {
      return {
        name: user.name,
        id: user._id
      };
    });
    res.render("adminUsers", {
      title: "Users",
      data: results,
      layout: 'adminMain'
    });
  });
};

/**
 * This is the admin page for a single user.
 * It is VERY similar to the user's "home page".
 * It also checks for any newly created decks.
 */
module.exports.adminUser = (req, res, next) => {
  let userId = req.params.userId;
  // Get the user
  models.user.findById(userId, (err, user) => {
    if (err) error("could not select user " + userId, err);
    if (!user) return res.render("404", {layout: 'adminMain'});
    // Update decks for the user - any new decks to consider?
    const oldIds = user.userDecks.map(deck => deck.deck);
    models.deck.find({ _id: { $nin: oldIds } }, (err, newDecks) => {
      if (err) error("could not update user " + userId, err);
      else if (!newDecks || newDecks.length < 1) {
        console.log(`No update needed for ${userId}`);
      } else {
        newDecks.forEach(deck => user.userDecks.push(newUserDeck(deck)));
        user.save(err => {
          if (err) error("could not save user " + userId, err);
          else console.log(`User ${userId} has ${newDecks.length} new decks`);
        });
      }
      // Show the user page
      res.render("adminUser", {
        title: "Decks for user " + user.name,
        userId: userId,
        data: user.userDecks.map(deck => {
          return {
            name: deck.name,
            day: deck.day,
            id: deck.deck,
            status: deck.active ? "Active" : "Inactive",
            layout: 'adminMain'
          };
        })
      });
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
        res.redirect("/adminUsers");
      });
    }
  });
};

/**
 * Activate or inactivate a deck for a given user
 * This also refreshes the cards in the deck. Why? Because there's no sense
 * in getting all the cards for decks the user isn't subscribed to. This 
 * way, only when the user subscribes do we get all the cards.
 */
module.exports.toggleUserDeck = (req, res, next) => {
  let userId = req.body.userId;
  // Find the user by ID
  models.user.findById(userId, (err, user) => {
    if (err || !user) error("could not find user " + userId, err);
    else {
      let deckId = req.body.deckId;
      // Find the deck to toggle in the user decks
      let userDeckMatch = user.userDecks.find(userDeck =>
        userDeck.deck.equals(deckId)
      );
      if (!userDeckMatch) error("could not find deck " + deckId);
      else {
        // Toggle the active flag
        // If the user deck is now active and the deck was never reviewed
        // (is empty), add cards and save; otherwise, just save
        userDeckMatch.active = userDeckMatch.active ? false : true;
        if (userDeckMatch.active && !userDeckMatch.lastReviewedOn) {
          models.card.find({ deck: deckId }, (err, cards) => {
            if (err || !cards) error("could not set up deck " + deckId, err);
            else {              
              const existing = userDeckMatch.myCards.map(card => card.card._id.toString());
              
              // Store incoming cardIDs at level 0
              let count = 0;
              cards.forEach(card => {                
                if (!existing.includes(card._id.toString())) {
                  userDeckMatch.myCards.push(newCard(card._id));
                  count++;
                }
              });
              console.log(`Found ${count} new cards`);
              // Save the user with this updated set of userDecks
              user.save(err => {
                if (err) error("could not save user " + userId, err);
                res.redirect("/adminUser/" + userId);
              });
            }
          });
        } else {
          user.save(err => {
            if (err) error("could not save user " + userId, err);
            res.redirect("/adminUser/" + userId);
          });
        }
      }
    }
  });
};

/**
 * "Sign in" currently meaning "choose the user to be"
 * This isn't secure, but the risks are fairly low right now.
 * This could someday be replaced by real authentication.
 */
module.exports.signIn = (req, res, next) => {
  let userName = req.body.name;

  models.user.findOne({ name: userName }, (err, user) => {
    if (err || !user) {
      error("could not find user " + userName, err);
      res.redirect("/adminHome");
    } else {
      res.redirect("/adminUser/" + user._id);
    }
  });
};

// Make a new user deck.
newUserDeck = deck =>
  new models.userDeck({
    active: false,
    deck: deck._id,
    name: deck.name,
    day: 0
  });

// Make a new user card.
newCard = cardId =>
  new models.myCard({
    card: cardId,
    level: 0
  });

function error(msg, err) {
  console.log(`Error ${msg} : ${err}`);
}
