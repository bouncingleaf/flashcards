/**
 * The users controller file for final project
 * @author Jessica Roy
 */

/* jshint esversion: 6 */

const DB = require("./dbConnection.js");
const models = DB.getModels();
const moment = require("moment");
let cardsToPractice, currentCard, pageTitle, userId, deckId;

/**
 * Kick off a practice session of the specified deck for the 
 * specified user.
 */
module.exports.start = (req, res, next) => {
  userId = req.body.userId;
  deckId = req.body.deckId;

  // Look up the user
  models.user.findById(userId, (err, user) => {
    if (err) error("could not find user " + userId, err);
    else if (!user) res.render("404");
    else {
      // Find the deck the user wants
      let myDeck = user.userDecks.find(userDeck =>
        userDeck.deck.equals(deckId)
      );
      // Update the deck (get it ready for quizzing)
      updateDeck(myDeck, user);
      // Figure out what levels the user should practice today
      levels = getLevelsToPractice(myDeck.day);
      // Get the cards for those levels
      const cardsAtRightLevels = myDeck.myCards
        .filter(myCard => levels.includes(myCard.level))
        .map(myCard => myCard.card);
      // Find the actual content for those cards
      models.card.find({ _id: { $in: cardsAtRightLevels } }, (err, cards) => {
        if (err) error("unable to get cards to study", err);
        if (!cards) res.render("404");
        cardsToPractice = cards.map(card => {
          return {
            front: card.front,
            back: card.back,
            id: card._id
          };
        });
        // Set the page title
        pageTitle = `${myDeck.name} (day ${myDeck.day})`;
        // If there are any cards to practice, start practicing
        if (cardsToPractice.length > 0) {
          currentCard = cardsToPractice.pop();
          res.render("practiceAsk", {
            title: "Practicing " + pageTitle,
            card: currentCard.front
          });
        } else {
          // If the user is done for the day, that's it
          // Note: In the updateDeck function, you can set the length of a 
          // "day" to be whatever you want. :) Useful for testing!
          res.render("practiceDone", {
            title: "You're done practicing " + pageTitle,
            userId: userId
          });
        }
      });
    }
  });
};

/**
 * The user would like to see the answer, so show both the front
 * and the back of the card. This page also asks them if they need
 * to practie it more or if they got it right.
 */
module.exports.answer = (req, res, next) => {
  res.render("practiceAnswer", {
    title: "Practicing " + pageTitle,
    front: currentCard.front,
    back: currentCard.back
  });
};

/**
 * Practice is underway! If there are any cards left for today, give the user
 * the next card to review. If there are no cards left, the user is done.
 */
module.exports.ask = (req, res, next) => {
   if (cardsToPractice.length > 0) {
    currentCard = cardsToPractice.pop();
    res.render("practiceAsk", {
      title: "Practicing " + pageTitle,
      card: currentCard.front
    });
  } else {
    res.render("practiceDone", {
      title: "You're done practicing " + pageTitle,
      userId: userId
    });
  }
};

/**
 * Handle the user's response about whether they want to practice this card
 * more or if they've got it right.
 * 
 */
module.exports.recordAnswer = (req, res, next) => {
  // 
  if (req.params.response) {
    models.user.findById(userId, (err, user) => {
      if (err) error("could not find user " + userId, err);
      else if (!user) res.render("404");
      else {
        // Find the deck I want
        let myDeck = user.userDecks.find(userDeck =>
          userDeck.deck.equals(deckId)
        );
        // Find the card in the deck
        cardInPlay = myDeck.myCards.find(myCard =>
          myCard.card.equals(currentCard.id)
        );
        // If the user got it wrong, demote it (but not if it's already level 1)
        if (req.params.response === "no" && cardInPlay.level > 1) cardInPlay.level--;
        // If the user got it right, promite it
        if (req.params.response === "yes") cardInPlay.level++;
        // Save
        user.save(err => {
          if (err) error("could not save user " + userId, err);
        });
        // Answer recorded! Go display the next card, if there is one.
        res.redirect("/practice/ask");
      }
    });
  }
};

/**
 * Updates the deck for the specified user. Specifically:
 * 1. Gets any recently added cards and stores them at level 0
 * 2. Promotes new cards to level 0, unless the user is maxed out
 * 3. Adds 1 to the day counter for the deck (See README.md)
 * 4. Updates the last practiced date/time
 */
function updateDeck(myDeck, user) {
  const deckId = myDeck.deck;

  // Maximum number of level 1 cards
  const MAX_NEW = 10;
  // Testing
  const WAIT_TIME = moment.duration(20, "seconds");
  // Recommended
  // const WAIT_TIME = moment.duration(1, 'days');

  // Get any recently added cards
  models.card.find({ deck: deckId }, (err, cards) => {
    if (err) error("could not set up deck " + deckId, err);
    if (!cards) console.log("No cards found in deck " + deckId);
    else {
      // Figure out what cards we already have
      const existing = myDeck.myCards.map(card => card.card._id.toString());

      // Store incoming cardIDs at level 0
      let count = 0;
      cards.forEach(card => {
        if (!existing.includes(card._id.toString())) {
          myDeck.myCards.push(newCard(card._id));
          count++;
        }
      });
      console.log(`Found ${count} new cards in deck ${myDeck.name}`);
    }
    // If now is at least WAIT_TIME since the deck was last practiced,
    // then promote new cards to level 0 until we run out or reach limit
    if (
      !myDeck.lastPracticedOn ||
      moment().isAfter(myDeck.lastPracticedOn.add(WAIT_TIME))
    ) {
      let count0 = myDeck.myCards.filter(myCard => myCard.level === 0).length;
      let count1 = myDeck.myCards.filter(myCard => myCard.level === 1).length;
      console.log(
        `Found ${count0} lev 0 cards and ${count1} lev1 cards, max is ${MAX_NEW}`
      );

      // Promote cards 0 -> 1 until we run out or reach MAX_NEW
      for (
        i = 0;
        i < myDeck.myCards.length && count0 > 0 && count1 < MAX_NEW;
        i++
      ) {
        if (myDeck.myCards[i].level === 0) {
          myDeck.myCards[i].level = 1;
          count0--;
          count1++;
        }
      }
      // Start the day counter, note last practiced date
      // myDeck.day++;
      // myDeck.lastPracticedOn = moment();
    }
    // Save
    user.save(err => {
      if (err) error("could not save user " + userId, err);
    });
  });
}

/**
 * Based on the day the user is on (in a 64-day cycle), 
 * determine which cards the user should review.
 * 
 * This chart is based on one from a book by Gabriel Wyner:
 * 
 * Wyner, G. (2014) _Fluent forever: How to learn any language fast and
 * never forget it_. Harmony Books (Crown Publishing Group, Random House
 * LLC), New York, p. 274 of the Kindle edition.
 * 
 * More information in README.md
 */
getLevelsToPractice = day => {
  const dayOf64 = day % 64;
  const dayOf16 = day % 16;
  // Special odd cases: day 59 and %16 = 13
  if (dayOf64 === 59) return [6, 2, 1];
  if (dayOf16 === 13) return [4, 2, 1];
  // All other odd # days:
  if (day % 2 === 1) return [2, 1];
  // Most even # days follow a regular-ish pattern:
  switch (dayOf16) {
    case 2:
      return [3, 1];
    case 4:
      return [4, 1];
    case 6:
      return [3, 1];
    case 10:
      return [3, 1];
    case 12:
      return [5, 1];
    case 14:
      return [3, 1];
  }
  // A few exceptions
  switch (dayOf64) {
    case 24:
      return [6, 1];
    case 56:
      return [7, 1];
    default:
      return [1];
  }
};

function error(msg, err) {
  console.log(`Error ${msg} : ${err}`);
}
