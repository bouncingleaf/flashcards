# Jessica Roy's Final Project for MET CS 602

## About

This is Jessica Roy's Final Project for Boston University MET CS 602 online, Professor Suresh Kalathur, summer term 2. 

There are two pieces: 

* flashcards - An app for practicing with flash cards.
* flashcards-admin - An app for manipulating users and decks of flash cards

They operate off the same database on heroku.

## Requirements

You will need NodeJS. You will need internet access.

The *flashcards* app can be run locally or remotely.

The *flashcards-admin* app can only be run locally. This is an oversimplified attempt to prevent completely arbitrary writes to the database.

## Setup

### To prepare the app to run:

* From both top level folders (the folders containing package.json), run: `npm install`

### To launch the flashcards app locally

* From the flashcards folder, run: `node ./app.js`

* Then visit http://localhost:5000/

### To launch the flashcards app remotely

* Visit https://stark-wildwood-97446.herokuapp.com/home/

### To launch the flashcards-admin app locally

* From the flashcards folder, run: `node ./app.js`

* Then visit http://localhost:5001/

## Using the admin app

### Users

The flashcards-admin application loads the users page as the home page (or, you can select Manage Users from the navigation bar at the top). 

On the users screen, you can:

* **Add a user** by typing in a value at the User Name field and chooosing Save.
* **Manage an existing user** by selecting Manage User to the right of the user's name.

### Manage User

On the screen to manage a single user, you will be presented with a list of decks available to the user. Each deck will have a Review Day listed and a Status. Click on the Status to toggle between Active and Inactive.

### Decks

Choose Manage Decks from the navigation bar at the top, and you will be brought into the deck management screen.

On the deck screen, you can:

* **Add a deck** by typing in a value at the Deck Name field and chooosing Save.
* **Manage an existing deck** by selecting Manage Deck to the right of the deck's name.

### Manage Deck

On the screen to manage a single deck, you can add a new card to the deck by specifying the Card Front and Card Back and choosing Save. You will also be presented with a list of cards in the deck. Each card will have a Card Front and Card Back. 

## Using the flashcards app

On the home screen, enter your username to sign in. No, this isn't in any way secure because authentication and authorization were not implemented as part of this project. However, the most someone can do is review your flash cards or toggle whether your decks are active or not.

### Decks

On the screen to manage a decks, you will be presented with a list of decks available to your user. Each deck will have a Review Day listed, a Status, and an option to Practice. You can:

* Click on the Status to toggle between Active and Inactive.
* Click on the Practice button to practice the deck. This works for active decks only.

## Accessing the JSON and XML APIs

You can set Accept 
Example: localhost:5000/user/5b70a501dce1c52af0f06565

## How card review works

This program uses a review schedule based on one from a book by Gabriel Wyner called _Fluent Forever: How to Learn Any Language Fast and Never Forget It_ (2014, Harmony Books, Crown Publishing Group, Random House LLC, New York, p. 274 of the Kindle edition). 

For each user, all the cards in a deck are ranked as level 0 through level 8. The levels represent the frequency of review in a 64 day cycle:

* Level 0 cards are pending cards, waiting to be pulled into the deck. They are not reviewed.
* Level 1 cards are reviewed daily.
* Level 2 cards are reviewed approximately every other day.
* Level 3 cards are reviewed approximately every four days (16 times in the 64 day cycle).
* Level 4 cards are reviewed eight times in the 64 day cycle.
* Level 5 cards are reviewed four times in the 64 day cycle.
* Level 6 cards are reviewed twice in 64 days.
* Level 7 cards are reviewed once in 64 days.
* Level 8 cards are "retired" and will not be reviewed. At this point, the user is considered to have learned these cards.

You can download a copy of the cycle here: https://fluent-forever.com/appendix3/

Every time we load the user, the program will:

1. Pull any new card IDs from the main deck into the user deck. 
2. Add those new cards as level 0 cards (there may already be cards there).

Each day, the program will:

1. Move up to N (say, 20) cards from level 0 into level 1. The number of new cards is limited to encourage the user to begin to master the cards at hand at least a little prior to adding new cards into the mix.
2. Start prompting the user with the cards they are due to review that day. So, if it is day 18 in the 64-day cycle, the user will review level 3 cards and level 1 cards.
3. If they get the card right (by the user's own assessment), the card goes up a level and will be reviewed less frequently. If they don't, it goes down a level (or stays at level 1) and will be reviewed more frequently.

## Packages used in this project include:
* ajv - required peer dependency 
* body-parser - for parsing forms
* csurf - CSRF protection
* dotenv - for use of the .env file, which holds environment variables such as database credentials
* express - nodjs webapplication framework
* express-handlebars - templating engine
* express-session - needed to support csurf
* moment - parsing dates and times
* mongoose - mongoDB

## Known bugs and future work

Bugs:

* Sometimes the user needs to inactivate and reactivate a newly activated deck to get it to work.
* Clicking Practice for an inactive deck does not work. The option should be removed.
* There's nothing preventing duplicate users, decks, or cards.

With more time, I could address the following:

* **Get the day count functionality to work**
* **Allow the admin to edit a card**
* **Allow the admin to delete cards from a deck**
* Allow the admin to inactivate or delete users
* Give the user a progress report
* Allow non-text for the front or back of cards: images, sound files, etc.
* Offer a "use reverse also?" checkbox when entering cards - duplicates the card but with front/back swapped
* Provide a real authentication and authorization scheme.

      <input type="hidden" name="_csrf" value="{{_csrfToken}}">


### Deprecation warning
If at any point in this process, you encounter an error stating "DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version," you can disregard this error, per Professor Kalathur.
