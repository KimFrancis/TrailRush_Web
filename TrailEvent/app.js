
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var db=require('./lib/db');
var dialog =require('dialog');
//var Event=require('./users/Event.js');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use('/public', express.static(__dirname + '/public'));

//search
var EventSchema= new db.Schema({
	 _id : String
	,EventName : String
	,EventDate : String
	,EventPlace : String
	,EventOrganizer : String
	,EventDescription : String
	,EventStations : Number
	,EventStatus : String

});
var MyEvent=db.mongoose.model('MyEvent',EventSchema);
//add
//add
function addEvent(_id, EventName, EventDate, EventPlace, EventOrganizer, EventDescription, EventStations, EventStatus, callback) {
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
}

var StationSchema = new db.Schema({
	 _id : String
	,EventName : String
	,StationID : String
	,StationName : String
});

var MyStation=db.mongoose.model('MyStation',StationSchema)

function addStation(_id, EventName, StationID, StationName, callback){
	var instance = new MyStation();
	instance._id = EventName+"."+StationID;
	instance.EventName = EventName;
	instance.StationID = StationID;
	instance.StationName = StationName;
	instance.save(function (err){
		if (err){
			callback(err);
		}
		else{
			callback(null, instance);
		}
	});

}

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


app.get('/addEvent',function(req, res){
	res.render('users/addevent');
});

//post new event
app.post('/addEvent', function(req, res) {
var _id = req.body.EventName;
var EventName = req.body.EventName;
var EventDate = req.body.EventDate; 
var EventPlace = req.body.EventPlace;
var EventOrganizer = req.body.EventOrganizer;
var EventDescription = req.body.EventDescription;
var EventStations = req.body.EventStations;
var EventStatus = "Upcoming";
addEvent(_id, EventName, EventDate, EventPlace, EventOrganizer, EventDescription, EventStations, EventStatus,  function(err, user) {
if (err) throw err;
MyEvent.find({"_id": req.body.EventName},function(err,docs){
		res.render('users/addstation', {users: docs});
		console.log(docs);
	});
});
});
app.post('/addstation',function(req,res){
	var _id =req.body.EventName+"."+req.body.StationID;
	var EventName = req.body.EventName;
	var StationID = req.body.StationID;
	var StationName = req.body.StationName;
	addStation(_id, EventName, StationID, StationName, function(err, user){
		if (err) throw err;
	});
});