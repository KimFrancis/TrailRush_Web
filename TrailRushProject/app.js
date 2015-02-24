
/**
 * Module dependencies.
 */

var express = require('express'),
    mongoose = require('mongoose');
     hash = require('./pass').hash;
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');
var app = express();

//LAGYAN NG MONGOOSE.CONNECT
mongoose.connect("mongodb://admin:admin@ds041831.mongolab.com:41831/trailrush");
//JOIN EVENT
var connection = mongoose.createConnection('mongodb://admin:admin@ds041831.mongolab.com:41831/trailrush');
var autoIncrement = require('mongoose-auto-increment');
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
var participants = mongoose.model('participants', Schema);
//JOIN EVENT
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    fname: String,
    age: String,
    gender: String,
    email: String,
    salt: String,
    hash: String
});

var User = mongoose.model('users', UserSchema);
var EventSchema = new mongoose.Schema({
     _id: String
    ,EventName: String
    ,EventDate: String
    ,EventPlace: String
    ,EventOrganizer: String
    ,EventDescription: String
    ,EventStations: String
    ,EventStatus: String

});
var MyEvents=mongoose.model('MyEvents', EventSchema);



app.param('EventName', function(req, res, next, EventName){
    MyEvents.find({EventName: EventName}, function(err,docs){
        req.MyEvent = docs[0];
        next();
    });
    });
// all environments
    app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.cookieParser('Authentication Tutorial '));
    app.use(express.session());
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    
    app.use(express.static(path.join(__dirname, 'public')));
});
app.use(function (req, res, next) {
    var err = req.session.error,
        msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});
/*
Helper Functions
*/
function authenticate(name, pass, fn) {
    if (!module.parent) console.log('authenticating %s:%s', name, pass);
    User.findOne({
        username: name
    },

    function (err, user) {
        if (user) {
            if (err) return fn(new Error('cannot find user'));
            hash(pass, user.salt, function (err, hash) {
                if (err) return fn(err);
                if (hash == user.hash) return fn(null, user);
                fn(new Error('invalid password'));
            });
        } else {
            return fn(new Error('cannot find user'));
        }
    });

}

function requiredAuthentication(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}

function userExist(req, res, next) {
    User.count({
        username: req.body.username
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {
            req.session.error = "User Exist"
            res.redirect("/signup");
        }
    });
}

/*
Routes

app.get("/", function (req, res) {

    if (req.session.user) {
        res.render("users/trailrushlogin");
    } else {
        res.redirect("/home");
    }
});
*/
//Show specific event
app.post('/Events/:EventName', function (req, res){
    res.render('users/search', { MyEvent: req.MyEvent});
});
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//WEBSITE DESIGN
app.get("/home", function (req,res){
    /*res.render("users/trailrush"),{ MyEvent: req.MyEvent});*/
    if (req.session.user){
        MyEvents.find({}, function (err, docs){
        res.render("users/trailrush", {trailevents: docs, title: "Already Login"});
        });
    }
    else {
        MyEvents.find({}, function (err, docs){
        res.render("users/trailrush", {trailevents: docs, title: "No Account"});
        });
    }
});

app.get("/Event/:id", function(req,res){
 MyEvents.find({'EventName':req.params.id}, function (err, docs){
 res.render('users/upcommingeventpost', {trailevents: docs});
 });
});

app.get("/signup", function (req, res) {
    if (req.session.user) {
        res.redirect("/home");
    } else {
        res.render("users/signup");
    }
});

app.post("/signup", userExist, function (req, res) {
    var password = req.body.password;
    var username = req.body.username;
    var fname = req.body.fname;
    var age = req.body.age;
    var gender = req.body.gender;
    var email = req.body.email;

    hash(password, function (err, salt, hash) {
        if (err) throw err;
        var user = new User({
            username: username,
            fname: fname,
            age: age,
            gender: gender,
            email: email,
            salt: salt,
            hash: hash,
        }).save(function (err, newUser) {
            if (err) throw err;
            authenticate(newUser.username, password, function(err, user){
                if(user){
                    req.session.regenerate(function(){
                        req.session.user = user;
                        req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                        res.redirect('/home');
                    });
                }
            });
        });
    });
});

app.get("/login",function (req,res,next){
    if (req.session.user) {
        res.redirect("/home");

    } else {
        next();
    }
}, function (req, res) {
    res.render("users/login");
 });

app.post("/login", function (req, res) {
    
    authenticate(req.body.username, req.body.password, function (err, user) {
        if (user) {
            req.session.regenerate(function () {
                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                res.redirect('/home');
            });
        } else {
            res.redirect('/login');
            req.session.error = 'Authentication failed, please check your ' + ' username and password.';
            

        }
    });
});

app.get('/logout', function (req, res) {
    req.session.destroy(function () {
        res.redirect('/home');
    });
});
app.get("/home/account" ,function (req,res,next){
     if (req.session.user) {
        
        next();
    } else {
        res.redirect("/home");
    }
},function(req,res){
    /*res.render("users/trailrush"),{ MyEvent: req.MyEvent});*/
 MyEvents.find({}, function (err, docs){
    console.log(docs);
 res.render("users/trailrushlogin", {trailevents: docs});
 });
});
app.get('/profile', requiredAuthentication, function (req, res) {
    res.send('Profile page of '+ req.session.user.username +'<br>'+' <a href="/logout">logout</a>');
});



//JOIN EVENT
app.get("/Join", function (req, res) {
    MyEvents.find({}, function (err, docs) {
        res.render('users/new_joinevent', { users : docs});
    });
});
app.post('/Join',function(req,res){
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
        res.render('users/show_joinevent', {users: docs});
    });
});
});
app.param('bibid', function (req, res, next, name) {
    participants.find({ bibid: bibid }, function (err, docs ) {
        req.users = docs[0];
        next();
    });
});







http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
