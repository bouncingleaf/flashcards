/**
 * Jessica Roy's final project
 */

/* jshint esversion: 6 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const routes = require('./routes/index');

const app = express();

// Set up handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Set the location of static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up bodyParser to handle forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Used for CSRF protection by csurf
app.use(require('cookie-parser')(process.env.COOKIE_SECRET));

// Set up csurf according to instructions in Express textbook
// app.use(require('csurf')({
//   cookie: true
// }));
// app.use(function(req, res, next){
//   res.locals._csrfToken = req.csrfToken();
//   next(); 
// });

// Routes
app.use('/', routes);

// Error handler
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  // Handle CSRF errors:
  res.status(403);
  res.render('403');
});

// Set a 404 page
app.use((req, res) => {
    res.status(404);
    res.render('404');
});

// Start listening on the specified port
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));