var db = require('../lib/db');
var mongoose=require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://john:john@ds031561.mongolab.com:31561/trailrush");
autoIncrement.initialize(connection);

var RunnerSchema = new db.Schema({
	Name: String
	,Age : String
});

RunnerSchema.plugin(autoIncrement.plugin, {
    model: 'Name',
    field: 'bib',
    startAt: 1000,
    incrementBy: 1
});


var Runners=db.mongoose.model('ListofRunners', RunnerSchema);

// Exports
module.exports.addPost =addPost;
// Add runner to database
function addPost(Name, Age, callback) {
	var instance = new Runners();
	instance.Name=Name;
	instance.Age=Age; 
	instance.save(function (err) {
		if (err) {
			callback(err);
		}
		else {
			callback(null, instance);
		}
	});
}