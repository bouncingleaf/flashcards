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

router.get('/home', mainModule.home);
router.get('/all', mainModule.displayAll);
router.get('/add', mainModule.add);
router.post('/add', mainModule.saveCard);
router.get('/privacy', mainModule.privacy);

router.get('/admin', mainModule.adminDecks);
router.get('/adminDecks', mainModule.adminDecks);
router.get('/adminCards', mainModule.adminCards);
router.get('/adminUsers', mainModule.adminUsers);

module.exports = router;
