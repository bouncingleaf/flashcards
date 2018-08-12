# Jessica Roy's Final Project for MET CS 602

## About

This is Jessica Roy's Final Project for Boston University MET CS 602 online, Professor Suresh Kalathur, summer term 2. 

## Requirements

You will need NodeJS. 

To run this **locally** (preferred), you will also need a local MongoDB installation set up according to the instructions in the MongoDB_Setup.pdf file provided by the professor.

To run this **remotely**, you can edit the credentials.js file to comment out the host and port, and uncomment the host and port for the remote system. This program has not been tested on the remote system, however.

## Setup

1. From the top level folder (the folder containing package.json), run:

    `npm install`

2. If running locally, start your MongoDB server according to the instructions in the MongoDB_Setup.pdf file provided by the professor.

## Running

1. To start the web server, run this from the top level folder:

    `node ./index.js`
    

2. If you are running locally, you can access the web server at:

    <http://localhost:3000>

## How card review

Each level represents how often we will review the cards:
* not yet seen (not reviewed until they go up a level)
* daily review
* every other day
* every 4 days
* every 8 days
* every 16 days
* every 32 days
* every 64 days
* retired (not reviewed anymore, the user has learned it)

Every time we load the user, we:
1. Pull any new card IDs from the main deck into the user deck. 
2. Add those new cards as "unseen" (there may already be cards there).

Each day we:
1. Move N (say, 20) cards from unseen into daily.
2. Start prompting the user with the cards they are due to review that day. 
3. If they get the card right, it goes up a level. If they don't, it goes down a level.

## Notes

### Deprecation warning
If at any point in this process, you encounter an error stating "DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version," you can disregard this error, per Professor Kalathur.
