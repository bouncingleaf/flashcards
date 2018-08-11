/**
 * The users controller file for final project
 * @author Jessica Roy
 */

/* jshint esversion: 6 */

const DB = require('./dbConnection.js');
const models = DB.getModels();
const moment = require('moment');

module.exports.practice = (req, res, next) => {
  
  let userId = req.body.userId;
  console.log(`user ${userId} chose Practice`);
  
  models.user.findById(userId, (err, user) => {
    if (err || !user) error('could not find user ' + userId, err);
    else {
      let deckId = req.body.deckId;
      let match = user.userDecks.find(deck => {
        return deck.deck.toString() == deckId;
      });
      if (!match) error('could not find deck ' + deckId);
      else {
        updateUserDeck(match);

        // Levels, e.g. [5,1]
        const practiceLevels = getLevelsToPractice(match.day);

        // Arrays, e.g. [[cardA],[cardB,...]]
        const practiceArrays = practiceLevels.map(level => match.levels[level]);

        // Find all the cards the user needs to review, keep track of their level
        models.card.find({_id: {$in : [].concat(...practiceArrays)}}, 
        (err, cards) => {
          // Arrays, e.g. [[{level: 5, {card, cardAData}],[{level: 1, card: cardBData},...]]
          const practiceCards = practiceLevels.map(level => {
            match.levels[level].map(card => {
              return {
                level: level,
                card: cards.find(dbCard => dbCard._id === card)
              }
            });
          });
          res.render('practice', { 
            title: 'Practicing ' + match.name,
            userId: userId,
            data: practiceCards
          });
        }); // end of card find
      }
    }
  });
};

updateUserDeck = userDeck => {
  // Maximum number of level 1 cards
  const MAX_NEW = 30;

  // Testing
  const WAIT_TIME = moment.duration(10, 'minutes');
  // Recommended
  // const WAIT_TIME = moment.duration(1, 'days');

  // If now is at least WAIT_TIME since lastPracticedOn,
  // then bring new cards in until we run out or reach limit
  if (moment().isAfter(userDeck.lastPracticedOn.add(WAIT_TIME))) {
    const lev = userDeck.levels;
    while (lev[0].length > 0 && lev[1].length < MAX_NEW) {
      lev[1].push(lev[0].pop());
    }
    // Start the day counter, note last practiced date
    userDeck.day++;
    userDeck.lastPracticedOn = moment();
  
  }
};

getLevelsToPractice = (day) => {
  let levelsToPractice = [];
  if (day % 64 === 0) levelsToPractice.push(7);
  if (day % 32 === 0) levelsToPractice.push(6);
  if (day % 16 === 0) levelsToPractice.push(5);
  if (day % 8 === 0) levelsToPractice.push(4);
  if (day % 4 === 0) levelsToPractice.push(3);
  if (day % 2 === 0) levelsToPractice.push(2);
  levelsToPractice.push(1);
  return levelsToPractice;
}

function error(msg, err) {
  console.log(`Error ${msg} : ${err}`);
}
