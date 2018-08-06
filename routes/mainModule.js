/**
* The mainModule file for final project
* @author Jessica Roy
*/

/* jshint esversion: 6 */

const DB = require('./dbConnection.js');
const models = DB.getModels();

// User screens

module.exports.home = (req, res, next) => {
  res.render('home', { title: "Home" });
};

module.exports.privacy = (req, res, next) => {
  res.render('privacy', { title: "Privacy" });
};

// Admin Screens

module.exports.adminDecks = (req, res, next) => {
  res.render('admin/decks', { title: "Admin Decks"});
};

module.exports.adminCards = (req, res, next) => {
  res.render('admin/cards', { title: "Admin Cards"});
};

module.exports.adminUsers = (req, res, next) => {
  res.render('admin/users', { title: "Admin Users"});
};

module.exports.add = (req, res, next) => {
  res.render('addView', { title: "Add" });
};

module.exports.saveCard =
(req, res, next) => {
  
  let item = new models.card({
    cardFront: req.body.front,
    cardBack: req.body.last
  });
  
  // item.save((err) => {
  //   if (err)
  //   console.log("Error : %s ", err);
  //   res.redirect('/all');
  // });
  res.render('404');
  
};

module.exports.displayAll =
(req, res, next) => {
  
  MyModel.find({}, (err, data) => {
    if (err)
    console.log("Error : %s ", err);
    
    let results = data.map((item) => {
      return {
        lastName: item.lastName,
        firstName: item.firstName,
        id: item._id,
      };
    });
    
    res.render('displayView',
    { title: "Some stuff", data: results });
  });
};
