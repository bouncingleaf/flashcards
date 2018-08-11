/**
 * The index file
 * @author Jessica Roy
 */

 /* jshint esversion: 6 */

const express = require('express');
const router = express.Router();
const main = require("../controllers/main");
// const cards = require("../controllers/cards");
// const decks = require("../controllers/decks");
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
router.get('/home/:userId', users.user);
router.get('/user/:userId', users.user);
router.post('/signIn', users.signIn);

module.exports = router;
