/**
* The main controller file for final project
* @author Jessica Roy
*/

/* jshint esversion: 6 */

// User screens

module.exports.home = (req, res, next) => {
  res.render('home', { title: 'Home' });
};
