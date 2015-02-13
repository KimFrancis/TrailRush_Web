/*var db = require('../lib/db');
var mongoose=require('mongoose');


var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://fachiz:112194@ds039431.mongolab.com:39431/trailrushdbase");
autoIncrement.initialize(connection);

//nextcount
//identitycounters
//end of nextcount
//end of nextcount
// Exports
module.exports.addPost =addPost;
// Add runner to database
function addPost(Runner, Age, callback) {
	var instance = new Runners();
	instance.Runner=Runner;
	instance.Age=Age; 
	instance.save(function (err) {
		if (err) {
			callback(err);
		}
		else {
			callback(null, instance);
		}
	});
}*/