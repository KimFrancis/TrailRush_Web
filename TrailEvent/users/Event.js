/*var db = require('../lib/db');

var EventSchema = new db.Schema({
	 _id: String
	,EventName: String
	,EventDate: String
	,EventPlace: String
	,EventOrganizer: String
	,EventDescription: String
	,EventStations: Number
	,EventStatus: String

});

var MyEvent=db.mongoose.model('MyEvent', EventSchema);

// Exports
module.exports.addPost =addPost;
// Add user to database
function addPost(_id, EventName, EventDate, EventPlace, EventOrganizer, EventDescription, EventStations, EventStatus, callback) {
	var instance = new MyEvent();
	instance._id = EventName;
	instance.EventName = EventName;
	instance.EventDate = EventDate;
	instance.EventPlace = EventPlace; 
	instance.EventOrganizer = EventOrganizer;
	instance.EventDescription = EventDescription;
	instance.EventStations = EventStations;
	instance.EventStatus = EventStatus;
	instance.save(function (err) {
		if (err) {
			callback(err);
		}
		else {
			callback(null, instance);
		}
	});
}*/