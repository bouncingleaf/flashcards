/**
 * The index file
 * @author Jessica Roy
 */

 /* jshint esversion: 6 */

const express = require('express');
const router = express.Router();
const mainModule = require("./mainModule");

// router specs
router.get('/', (req, res, next) => {
  res.redirect('/home');
});

// User routes
router.get('/home', mainModule.home);
router.get('/privacy', mainModule.privacy);

// Admin routes
router.get('/admin', mainModule.decks);
router.get('/cards', mainModule.decks);
router.get('/cards/:deckID', mainModule.cards);
router.get('/decks', mainModule.decks);
router.get('/users', mainModule.users);


router.post('/addCard/:deckID', mainModule.saveCard);
router.post('/addDeck', mainModule.saveDeck);
router.post('/addUser', mainModule.saveUser);


module.exports = router;
