/**
 * The index file
 * @author Jessica Roy
 */

 /* jshint esversion: 6 */

const express = require('express');
const router = express.Router();
const main = require("../controllers/main");
const cards = require("../controllers/cards");
const decks = require("../controllers/decks");
const users = require("../controllers/users");

// router specs
router.get('/', (req, res, next) => {
  res.redirect('/home');
});

// User routes
router.get('/home', main.home);
router.get('/privacy', main.privacy);
router.get('/practice', main.home);
router.post('/practice', users.practice);

// Both user and admin
router.get('/home/:userId', users.user);
router.get('/user/:userId', users.user);

// Admin routes
router.get('/admin', decks.decks);
router.get('/cards/:deckId', cards.cards);
router.get('/cards', decks.decks);
router.get('/decks', decks.decks);
router.get('/users', users.users);
router.post('/signIn', users.signIn);
router.post('/addCard/:deckId', cards.saveCard);
router.post('/addDeck', decks.saveDeck);
router.post('/addUser', users.saveNewUser);
router.post('/toggleUserDeck', users.toggleUserDeck);

module.exports = router;
