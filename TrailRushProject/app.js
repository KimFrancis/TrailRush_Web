
/**
 * Module dependencies.
 */

var express = require('express'),
	mongoose = require('mongoose');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');

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

//LAGYAN NG MONGOOSE.CONNECT
mongoose.connect('mongodb://admin:admin@ds041831.mongolab.com:41831/trailrush');

var EventSchema = new mongoose.Schema({
	 _id: String
	,EventName: String
	,EventDate: String
	,EventPlace: String
	,EventOrganizer: String
	,EventDescription: String

});

var MyEvents=mongoose.model('MyEvents', EventSchema);

app.param('EventName', function(req, res, next, EventName){
	MyEvents.find({EventName: EventName}, function(err,docs){
		req.MyEvent = docs[0];
		next();
	});
	});

//show all events
app.get("/", function(req,res){
 MyEvents.find({}, function (err, docs){
 	console.log(docs);
 res.render('users/events', {users: docs});
 });
});

//Show specific event
app.post('/Events/:EventName', function (req, res){
	res.render('users/search', { MyEvent: req.MyEvent});
});
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

//WEBSITE DESIGN
app.get("/home",function(req,res){
	/*res.render("users/trailrush"),{ MyEvent: req.MyEvent});*/
 MyEvents.find({}, function (err, docs){
 	console.log(docs);
 res.render("users/trailrush", {trailevents: docs});
 });
});

app.get("/Event/:id", function(req,res){
 MyEvents.find({'EventName':req.params.id}, function (err, docs){
 res.render('users/search', {trailevents: docs});
 });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
