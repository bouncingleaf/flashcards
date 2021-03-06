# Jessica Roy's Flash Cards Project

## About

This is Jessica Roy's final project for Boston University MET CS 602, Server Side Web Development, with Professor Suresh Kalathur, summer term 2, 2018. 

This app's primary purpose is as a demonstration of NodeJS, Express using Handlebars, and MongoDB using Mongoose. 

It is a flashcards app is to help practice with flash cards using a "spaced repetition" system described by Gabriel Wyner in his book _Fluent Forever_. (See more information about this system below.)

There are two parts to the app:

1. A user interface - users can select a deck to practice with. This is accessible locally or on heroku.
2. An admin interface - admins can enter new users, enter new decks, and enter cards into the decks. The admin interface can only be accessed locally.

You will need NodeJS. You will need internet access so the app can talk to the database, which is hosted on mlab.com.

## Setup

### To prepare the app to run:

- From the flashcards folder (the folder containing package.json), run: `npm install`

### To launch the flashcards app locally

- From the flashcards folder, run: `node ./app.js`. It should give you a message in a few moments: "Listening on 5000". 

- To access the user interface, visit http://localhost:5000/

- To access the admin interface, visit http://localhost:5000/adminHome

### To launch the flashcards app remotely

- Visit https://cs602-flashcards.herokuapp.com/home

## Using the admin app

I recommend starting with the admin app, because then you can see what users exist and/or create your own user!

http://localhost:5000/adminHome

### Users

The flashcards-admin application loads the users page as the home page (or, you can select Manage Users from the navigation bar at the top).

On the users screen, you can:

- **Add a user** by typing in a value at the User Name field and chooosing Save.
- **Manage an existing user** by selecting Manage User to the right of the user's name. A few users who have been active: heron, finch, and cardinal.

### Manage User

On the screen to manage a single user, you will be presented with a list of decks available to the user. Each deck will have a Review Day listed and a Status. Click on the Status to toggle between Active and Inactive.

### Decks

Choose Manage Decks from the navigation bar at the top, and you will be brought into the deck management screen.

On the deck screen, you can:

- **Add a deck** by typing in a value at the Deck Name field and chooosing Save.
- **Manage an existing deck** by selecting Manage Deck to the right of the deck's name.

### Manage Deck

On the screen to manage a single deck, you can add a new card to the deck by specifying the Card Front and Card Back and choosing Save. You will also be presented with a list of cards in the deck. Each card will have a Card Front and Card Back.

## Using the flashcards app

On the home screen, enter your username to sign in. No, this isn't in any way secure because authentication and authorization were not implemented as part of this project. However, the most someone can do is review your flash cards or toggle whether your decks are active or not.

### Decks

On the screen to manage a decks, you will be presented with a list of decks available to your user. Each deck will have a Review Day listed, a Status, and an option to Practice. You can:

- Click on the Status to toggle between Active and Inactive.
- Click on the Practice button to practice the deck. This works for active decks only.

## Accessing the JSON and XML APIs

You can access the user API given a specific user IDL

GET localhost:5000/user/USER_ID

Find your favorite user's user ID by looking at their user page in a browser).

You can set a header of either:

- Accept: application/json
- Accept: application/xml

Example:

    GET localhost:5000/user/5b70a501dce1c52af0f06565

## How card review works

This program uses a review schedule based on one from a book by Gabriel Wyner called _Fluent Forever: How to Learn Any Language Fast and Never Forget It_ (2014, Harmony Books, Crown Publishing Group, Random House LLC, New York, p. 274 of the Kindle edition).

For each user, all the cards in a deck are ranked as level 0 through level 8. The levels represent the frequency of review in a 64 day cycle:

- Level 0 cards are pending cards, waiting to be pulled into the deck. They are not reviewed.
- Level 1 cards are reviewed daily.
- Level 2 cards are reviewed approximately every other day.
- Level 3 cards are reviewed approximately every four days (16 times in the 64 day cycle).
- Level 4 cards are reviewed eight times in the 64 day cycle.
- Level 5 cards are reviewed four times in the 64 day cycle.
- Level 6 cards are reviewed twice in 64 days.
- Level 7 cards are reviewed once in 64 days.
- Level 8 cards are "retired" and will not be reviewed. At this point, the user is considered to have learned these cards.

You can download a copy of the cycle here: https://fluent-forever.com/appendix3/

Every time we load the user, the program will:

1. Pull any new card IDs from the main deck into the user deck.
2. Add those new cards as level 0 cards (there may already be cards there).

Each day, the program will:

1. Promote up to N (say, 20) cards from level 0 into level 1. The number of new cards is limited to encourage the user to begin to master the cards at hand at least a little prior to adding new cards into the mix.
2. Start prompting the user with the cards they are due to review that day. So, if it is day 18 in the 64-day cycle, the user will review level 3 cards and level 1 cards.
3. If they get the card right (by the user's own assessment), the card goes up a level and will be reviewed less frequently. If they don't, it goes down a level (or stays at level 1) and will be reviewed more frequently.

## Packages used in this project

- ajv - required peer dependency (for moment, I think)
- body-parser - for parsing forms
- csurf - https://github.com/expressjs/csurf - CSRF protection for express
- dompurify - https://www.npmjs.com/package/dompurify - for sanitizing input
- dotenv - https://www.npmjs.com/package/dotenv - for the .env file, to hold environment variables such as database credentials
- express - nodjs webapplication framework
- express-handlebars - templating engine
- jsdom - https://www.npmjs.com/package/jsdom - needed for dompurify
- moment - https://momentjs.com/ - parsing dates and times
- mongoose - mongoDB

## Recent updates


### It is now one app instead of two!

- I used .gitignore to keep the admin code off the heroku site.
- I set up an environment variable to drive whether or admin routes are set up. If you visit /adminHome, for example, on the heroku site, you will get a 404.
- This made the code a **lot** simpler and allowed me to reuse code instead of duplicating it (e.g. dbConnection.js)

### CSRF protection

I've implemented Cross-Site Request Forgery protection using a package called csurf. If you want to try it out, comment out one of the lines that looks like this in one of the admin handlebars files:

`<input type="hidden" name="_csrf" value="{{_csrfToken}}">`

Then try to fill out the corresponding form. It should send you to a 403 page.

I am using cookies for this. I looked up the regulations and found this: "Cookies clearly exempt from consent according to the EU advisory body on data protection- WP29pdf include: ... user‑centric security cookies, used to detect authentication abuses, for a limited persistent duration" -- http://ec.europa.eu/ipg/basics/legal/cookies/index_en.htm

### Restricted input

You can no longer enter the entire Declaration of Independence as a username, for example. Input fields that are stored have a max length. The username field is restricted to letters, numbers, and underscores. I have set up a sanitizer called DOMPurify to sanitize all input as well, although I haven't tested it.

### "Day Counts" are now ON... but the day is 20 seconds long

You can see what it is like for a user to progress from day to day in this program, because for testing purposes the day is only 20 seconds long. Wait 20 seconds, and it's a new "day" and the user is presented with new cards to practice.



### Other improvements

* The admin can now edit or delete a card in a deck. It is using POST, I should look into making it use PATCH. 
* I removed the Practice button for decks that aren't active for the user.
* I added some statistics for the user so they can see how they're doing and watch cards move up to new levels.
* The Heroku app used to be called "stark-wildwood-97446" which was randomly-generated by Heroku. Now it is cooler: https://cs602-flashcards.herokuapp.com/home. However, it won't work unless I switch it on. :)


## Known bugs and future work

Bugs:

- I THOUGHT it was that sometimes the user needs to inactivate and reactivate a newly activated deck to get it to work. It's really that sometimes the user needs to choose Practice twice.
- There's nothing preventing duplicate users, decks, or cards.
- Retrieving the user does update the decks for the user - which means the GET is not strictly without side effects. This should be broken out into two separate processes so that the user can be retrieved without any side effects.
- I am not sure the day incrementing is working correctly... but I don't think that's essential to this assignment.

With more time, I could address the following:

- Allow the admin to inactivate or delete users
- Allow non-text for the front or back of cards: images, sound files, etc.
- Offer a "use reverse also?" checkbox when entering cards - duplicates the card but with front/back swapped
- Provide a real authentication and authorization scheme!
