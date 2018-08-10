/**
* The main controller file for final project
* @author Jessica Roy
*/

/* jshint esversion: 6 */

// User screens

module.exports.home = (req, res, next) => {
  res.render('home', { title: 'Home' });
};

module.exports.privacy = (req, res, next) => {
  res.render('privacy', { title: 'Privacy' });
};

module.exports.quiz = (req, res, next) => {
  res.render('quiz', {title: 'Quiz'});
}