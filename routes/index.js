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

router.get('/all', mainModule.displayAll);
router.get('/add', mainModule.add);
router.post('/add', mainModule.save);
router.get('/privacy', mainModule.privacy);

module.exports = router;
