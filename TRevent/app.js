
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');
var mongoose=require('./lib/db');
var Event=require('./lib/event.js');
/*var mongoose =require('mongoose')*/

/*//db
var EventSchema = new mongoose.Schema({
	_id: String
	,EventName: String
	,EventDate: String
	,EventPlace: String
	,EventOrganizer: String
	,eventDescription: String
});
var MyEvent=mongoose.mongoose.model('Post', EventSchema);*/

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
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*app.get('/', routes.index);
app.get('/users', user.list);*/

//Add new event
app.get("/AddEvent", function(req, res){
	fs.readFile('./AddEvent.html', function(error, content) {
if (error) {
res.writeHead(500);
res.end();
}
else {
res.writeHead(200, { 'Content-Type': 'text/html' });
res.end(content, 'utf-8');
}
});
});

//post new event
app.post('/NewEvent', function(req, res) {
var _id = req.body.EventName;
var EventName = req.body.EventName;
var EventDate = req.body.EventDate; 
var EventPlace = req.body.EventPlace;
var Eventorganizer = req.body.EventOrganizer;
var EventDescription = req.body.EventDescription;
Event.addPost(_id, EventName, EventDate, EventPlace, Eventorganizer, EventDescription, function(err, user) {
if (err) throw err;
res.send("     The Event was successfully added.");
});
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
