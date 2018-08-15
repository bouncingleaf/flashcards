/**
 * The index file
 * @author Jessica Roy
 */

/* jshint esversion: 6 */

const express = require("express");
const router = express.Router();
const main = require("../controllers/main");
const practice = require("../controllers/practice");
const users = require("../controllers/users");
const ADMIN = process.env.FLASHCARDS_MODE === 'ADMIN';

// router specs
router.get("/", (req, res, next) => {
  res.redirect("/home");
});

// User routes
router.get("/home", main.home);
router.get("/practice", main.home);
router.post("/practice/answer", practice.answer);
router.get("/practice/ask", practice.ask);
router.post("/practice/:response", practice.recordAnswer);
router.post("/practice", practice.start);
router.get("/home/:userId", users.user);
router.get("/user/:userId", users.user);
router.post("/signIn", users.signIn);
router.post("/toggleUserDeck", users.toggleUserDeck);

if (ADMIN) {
  const adminCards = require("../controllers/adminCards");
  const adminDecks = require("../controllers/adminDecks");
  const adminUsers = require("../controllers/adminUsers");
  //
  router.get("/adminHome", adminUsers.users);
  router.get("/adminHome/:userId", adminUsers.adminUser);
  router.get("/adminUser/:userId", adminUsers.adminUser);
  router.get("/admin", adminDecks.decks);
  router.get("/adminCards/:deckId", adminCards.cards);
  router.get("/adminCards", adminDecks.decks);
  router.get("/adminDecks", adminDecks.decks);
  router.get("/adminUsers", adminUsers.users);
  router.post("/adminSignIn", adminUsers.signIn);
  router.post("/addCard/:deckId", adminCards.saveCard);
  router.post("/addDeck", adminDecks.saveDeck);
  router.post("/addUser", adminUsers.saveNewUser);
  router.post("/adminToggleUserDeck", adminUsers.toggleUserDeck);
}

module.exports = router;
