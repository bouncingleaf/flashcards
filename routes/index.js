/**
 * The index file
 * @author Jessica Roy
 */

 /* jshint esversion: 6 */

const express = require('express');
const router = express.Router();
const main = require("../controllers/main");
const practice = require("../controllers/practice");
const users = require("../controllers/users");

// router specs
router.get('/', (req, res, next) => {
  res.redirect('/home');
});

// User routes
router.get('/home', main.home);
router.get('/privacy', main.privacy);
router.get('/practice', main.home);
router.post('/practice', practice.start);
router.get('/home/:userId', users.user);
router.get('/user/:userId', users.user);
router.post('/signIn', users.signIn);
router.post('/toggleUserDeck', users.toggleUserDeck);

module.exports = router;
