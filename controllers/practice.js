/**
 * The users controller file for final project
 * @author Jessica Roy
 */

/* jshint esversion: 6 */

const DB = require("./dbConnection.js");
const models = DB.getModels();
const moment = require("moment");
let cardsToPractice;
let currentCard;
let pageTitle;
let userId;

module.exports.start = (req, res, next) => {
  userId = req.body.userId;
  const deckId = req.body.deckId;

  models.user.findById(userId, (err, user) => {
    if (err) error("could not find user " + userId, err);
    else if (!user) res.render("404");
    else {
      // Find the deck I want
      let myDeck = user.userDecks.find(userDeck =>
        userDeck.deck.equals(deckId)
      );
      updateDeck(myDeck, user);
      levels = getLevelsToPractice(myDeck.day);
      const cardsToStudy = myDeck.myCards
        .filter(card => levels.includes(card.level))
        .map(card => card.card);
      models.card.find({ _id: { $in: cardsToStudy } }, (err, cards) => {
        if (err) error("unable to get cards to study", err);
        if (!cards) res.render("404");
        cardsToPractice = cards.map(card => {
          return {
            front: card.front,
            back: card.back,
            id: card._id
          };
        });
        pageTitle = `${myDeck.name} (day ${myDeck.day})`;
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
      });
    }
  });
};

// They want to see the answer
module.exports.answer = (req, res, next) => {
  console.log(`you clicked answer`);
  res.render("practiceAnswer", {
    title: "Practicing " + pageTitle,
    front: currentCard.front,
    back: currentCard.back
  });
};

// They saw the answer, for better or worse, ask again
module.exports.ask = (req, res, next) => {
  console.log("you clicked ask", req.params, currentCard);
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
    user.save(err => {
      if (err) error("could not save user " + userId, err);
    });
  });
}

getLevelsToPractice = day => {
  // This chart is based on one from a book by Gabriel Wyner:
  //
  // Wyner, G. (2014) _Fluent forever: How to learn any language fast and
  // never forget it_. Harmony Books (Crown Publishing Group, Random House
  // LLC), New York, p. 274 of the Kindle edition.
  //
  const dayOf64 = day % 64;
  const dayOf16 = day % 16;
  // Special odd cases: day 59 and %16 = 13
  if (dayOf64 === 59) return [6, 2, 1];
  if (dayOf16 === 13) return [4, 2, 1];
  // All other odd # days
  if (day % 2 === 1) return [2, 1];
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
  switch (dayOf64) {
    case 16:
      return [2, 1];
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
