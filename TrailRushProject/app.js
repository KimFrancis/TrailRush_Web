
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
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
});
//LAGYAN NG MONGOOSE.CONNECT
mongoose.connect('mongodb://admin:admin@ds041831.mongolab.com:41831/trailrush');
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

});

var MyEvents=mongoose.model('MyEvents', EventSchema);

app.param('EventName', function(req, res, next, EventName){
    MyEvents.find({EventName: EventName}, function(err,docs){
        req.MyEvent = docs[0];
        next();
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
*/
app.get("/", function (req, res) {

    if (req.session.user) {
        res.send("Welcome " + req.session.user.username + "<br>" + "<a href='/logout'>logout</a>");
    } else {
        res.send("<a href='/login'> Login</a>" + "<br>" + "<a href='/signup'> Sign Up</a>");
    }
});

app.get("/signup", function (req, res) {
    if (req.session.user) {
        res.redirect("/");
    } else {
        res.render("signup");
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
                        res.redirect('/');
                    });
                }
            });
        });
    });
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login", function (req, res) {
    authenticate(req.body.username, req.body.password, function (err, user) {
        if (user) {

            req.session.regenerate(function () {

                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                res.redirect('/');
            });
        } else {
            req.session.error = 'Authentication failed, please check your ' + ' username and password.';
            res.redirect('/login');
        }
    });
});

app.get('/logout', function (req, res) {
    req.session.destroy(function () {
        res.redirect('/');
    });
});

app.get('/profile', requiredAuthentication, function (req, res) {
    res.send('Profile page of '+ req.session.user.username +'<br>'+' <a href="/logout">logout</a>');
});
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
