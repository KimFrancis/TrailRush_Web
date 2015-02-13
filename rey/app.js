
/**
 * Module dependencies.
 */

var express = require('express')
var routes = require('./routes');
  var mong = require('mongoose');
  var http = require('http');
var fs = require('fs');
var Runner=require('./lib/participant.js');
var mongoose=require('./lib/db');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});
//mongoose

//
var autoIncrement = require('mongoose-auto-increment');
var connection = mong.createConnection('mongodb://admin:admin@ds041831.mongolab.com:41831/trailrush');
autoIncrement.initialize(connection);
var Schema = new mongoose.Schema({
		fullname: String,
		address: String,
		event: String,
		age: String,
		gender: String,
		emailaddress: String,
		contactnumber: String
});
	Schema.plugin(autoIncrement.plugin, {
    model: 'participants',
    field: 'bibid',
    startAt: 1000,
    incrementBy: 1
});
var participants = mongoose.mongoose.model('participants', Schema);

var EventSchema = new mongoose.Schema({
	 _id: String
	,EventName: String
	,EventDate: String
	,EventPlace: String
	,EventOrganizer: String
	,EventDescription: String

});

var MyEvents=mongoose.mongoose.model('MyEvents', EventSchema);

app.get("/users", function (req, res) {
	MyEvents.find({}, function (err, docs) {
		res.render('users/new', { users : docs});
	});
});

app.post('/users',function(req,res){
	var a = req.body;
	new participants({
		fullname: a.fullname,
		address: a.address,
		event: a.event,
		age: a.age,
		gender: a.gender,
		emailaddress: a.emailaddress,
		contactnumber: a.contactnumber,

	}).save(function (err, users){
		if(err) res.json(err);
		participants.find({"fullname": req.body.fullname},function(err,docs){
		res.render('users/show', {users: docs});
	});
});
});

app.param('bibid', function (req, res, next, name) {
	participants.find({ bibid: bibid }, function (err, docs ) {
		req.users = docs[0];
		next();
	});
});

//search
app.post("/search", function(req,res){
 participants.find({"bibid":req.body.bibid}, function (err, docs){
 res.render("users/searchshow", {users: docs});
 });
});

//shows
app.get('/search/:bibid', function (req, res) {
	res.render("users/searchshow", { users: req.user });
});

app.get('/search', function(req, res) {
fs.readFile('./search.html', function(error, content) {
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

// Routes

app.get('/', routes.index);


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
