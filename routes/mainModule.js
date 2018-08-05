/**
* The mainModule file for final project
* @author Jessica Roy
*/

/* jshint esversion: 6 */

const DB = require('./dbConnection.js');
const MyModel = DB.getModel();

module.exports.add = (req, res, next) => {
  res.render('addView', { title: "Add" });
};

module.exports.home = (req, res, next) => {
  res.render('home', { title: "Home" });
};

module.exports.privacy = (req, res, next) => {
  res.render('privacy', { title: "Privacy" });
};

module.exports.save =
(req, res, next) => {
  
  let item = new MyModel({
    firstName: req.body.first,
    lastName: req.body.last
  });
  
  item.save((err) => {
    if (err)
    console.log("Error : %s ", err);
    res.redirect('/all');
  });
  
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
