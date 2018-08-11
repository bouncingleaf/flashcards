/**
 * The users controller file for final project
 * @author Jessica Roy
 */

/* jshint esversion: 6 */

const DB = require('./dbConnection.js');
const models = DB.getModels();


module.exports.practice = (req, res, next) => {
  
  let userId = req.body.userId;
  models.user.findById(userId, (err, user) => {
    if (err || !user) error('could not find user ' + userId, err);
    else {
      let deckId = req.body.deckId;
      let match = user.userDecks.find(deck => {
        return deck.deck.toString() == deckId;
      });
      if (!match) error('could not find deck ' + deckId);
      else {
        res.render('practice', { 
          title: 'Practicing ' + match.name,
          userId: userId,
          data: match
        });
      }
    }
  });
};

updateUserDeck(userDeck) {
  if (userDeck.day === 0) {
    // This is the first time the user has seen this
    
    userDeck.day = 1;
    userDeck.lastPracticedOn = new Date;

  }
}
Each level represents how often we will review the cards:
0 = not yet seen (not reviewed until they go up a level)
1 = daily
2 = every other day
3 = every 4 days
4 = every 8 days
5 = every 16 days
6 = every 32 days
7 = every 64 days
8 = retired (not reviewed anymore, the user has learned it)



function error(msg, err) {
  if (err) console.log('Error %s : %s', msg, err);
  else console.log('Error %s', msg);
}
