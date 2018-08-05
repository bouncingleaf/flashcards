/**
 * The dbConnection file 
 * @author Jessica Roy
 * Based on code provided in class by Suresh Kalathur
 */

 /* jshint esversion: 6 */

const mongoose = require('mongoose');
const dbUrl = process.env.MONGODB_URI;

let connection = null;
let model = null;

const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const mySchema = new Schema({
	firstName: String,
	lastName: String
});

module.exports.getModel = 
	() => {
		if (connection == null) {
			console.log("Creating connection and model...");
			connection = mongoose.createConnection(dbUrl, { useNewUrlParser: true });
			model = connection.model("MyModel", 
								mySchema);
		}
		return model;
	};
