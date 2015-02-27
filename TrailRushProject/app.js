
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
var emailCri;

//LAGYAN NG MONGOOSE.CONNECT
mongoose.connect("mongodb://admin:admin@ds041831.mongolab.com:41831/trailrush");
//JOIN EVENT
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection('mongodb://admin:admin@ds041831.mongolab.com:41831/trailrush');
autoIncrement.initialize(connection);
var Schema = new mongoose.Schema({
        _id:String,
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
    password: String,
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
//joinevent
var StatsSchema = new mongoose.Schema({
     _id: String,
    fullname: String,
    event: String,
});
var MyStats=mongoose.model('MyStats', StatsSchema);
//profile schema
var ProfileSchema = new mongoose.Schema({
     _id: String
    ,FName: String
    ,Address: String
    ,Age: Number
    ,Gender: String
    ,EMail: String
    ,Contact: String
});
var Profile=mongoose.model('Profile', ProfileSchema);

//stats
var MyStatsSchema = new mongoose.Schema({
  FName: String
  ,bibid: Number
  ,EventName: String
  ,Date: Number
  ,Station: String
});

var stats=mongoose.model('stats', MyStatsSchema);

//joinevent
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
//joinevent
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});
//joinevent
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
function authenticate(email, pass, fn) {
    if (!module.parent) console.log('authenticating %s:%s', email, pass);
    User.findOne({
        email: email
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
        email: req.body.email
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
        MyEvents.aggregate(
    /*{ $match: 
        { "EventStatus": "Upcoming" 
    } 
    },*/
    {
        $group : {
        _id : "$EventStatus"
        ,EventName: {
            $addToSet: "$EventName"
        }
        ,EventDate: {
            $addToSet: "$EventDate"
        }
    }
},
{ 
    $sort : { 
            "_id" : 1
        } 
    },
function (err, xEvent){
    Profile.find({"EMail":emailCri}, function (err, xProfile){
        res.render('users/trailrush',{
        xEvent : xEvent,
        xProfile : xProfile,
        title : "Already Login"
        });
        console.log(xProfile);
    })

    /*console.log(docs);
    res.render('users/trailrush', {xEvent: xEvent ,title: "Already Login"});*/

});

    }
    else {
        MyEvents.aggregate(
    /*{ $match: 
        { "EventStatus": "Upcoming" 
    } 
    },*/
    {
        $group : {
        _id : "$EventStatus"
        ,EventName: {
            $addToSet: "$EventName"
        }
        ,EventDate: {
            $addToSet: "$EventDate"
        }
    }
},
{ 
    $sort : { 
            "_id" : 1
        } 
    },
function (err, xEvent){
        res.render('users/trailrush',{
        xEvent : xEvent,
        title : "No Account"
        });

    /*console.log(docs);
    res.render('users/trailrush', {xEvent: xEvent ,title: "Already Login"});*/

});

    }//end of else

});

app.get("/Event/:id", function(req,res){
        if (req.session.user) {
        console.log('logged-in');
        MyEvents.find({'EventName':req.params.id}, function (err, xEvent) {
            
            stats.aggregate(
                { 
                    $sort : { 
                        "Station" : 1
                    } 
                },
                { 
                    $match: {
                        "EventName": req.params.id 
                    } 
                },
                {
                    $group : {
                        _id : "$FName",
                        bibid: {
                            $addToSet: "$bibid"
                        },
                        Station: {
                            $addToSet: "$Station"
                        },
                        "Date": {
                            $addToSet: "$Date"
                        }
                    }
                },
                function (err, xUsers){
                    Profile.find({"EMail":emailCri},function (err, xProfile){
                        res.render('users/upcommingeventpost',{ 
                        xEvent : xEvent,
                        xUsers: xUsers, 
                        xProfile: xProfile,
                        title: "Already Login"

                    });
                    
                    });//edn of find profile
                    //res.render('users/upcommingeventpost', {trailevents: docs, title: "Already Login"});
                
                }); // end of stats.aggregate
            
        }); // end of finding event name

    } else {
        // @TODO: support for users that arent signed-in
                MyEvents.find({'EventName':req.params.id}, function (err, xEvent) {
            
            stats.aggregate(
                { 
                    $sort : { 
                        "Station" : 1
                    } 
                },
                { 
                    $match: {
                        "EventName": req.params.id 
                    } 
                },
                {
                    $group : {
                        _id : "$FName",
                        bibid: {
                            $addToSet: "$bibid"
                        },
                        Station: {
                            $addToSet: "$Station"
                        },
                        "Date": {
                            $addToSet: "$Date"
                        }
                    }
                },
                function (err, xUsers){
                    
                    res.render('users/upcommingeventpost',{ 
                        xEvent : xEvent,
                        xUsers: xUsers, 
                        title: "No Account"
                    });
                    //res.render('users/upcommingeventpost', {trailevents: docs, title: "Already Login"});
                
                }); // end of stats.aggregate
            
        });
    }
 
});

//join event
app.post("/Event/:id",function (req, res){
    var a = req.body;
    new participants({
        _id: a.FName+"."+req.params.id,
        fullname: a.FName,
        address: a.Address,
        event: req.params.id,
        age: a.Age,
        gender: a.Gender,
        emailaddress: a.EMail,
        contactnumber: a.Contact,

    }).save(function (err, users){
        if(err) res.json(err);
        participants.find({"_id": req.body.FName+"."+req.params.id},function(err,docs){
        res.render('users/show_joinevent', {users: docs});
    });
});

});//end of join event
//sign up
app.get("/signup",function (req,res,next){
    if (req.session.user) {
        res.redirect("/home");

    } else {
        next();
    }
}, function (req, res) {
    res.render("users/signup");
 });
app.post("/signup", userExist, function (req, res) {
    var password = req.body.password;
    var email = req.body.email;

    hash(password, function (err, salt, hash) {
        if (err) throw err;
        var user = new User({
            email: email,
            salt: salt,
            hash: hash,
        }).save(function (err, newUser) {
            if (err) throw err;
            authenticate(newUser.email, password, function(err, user){
                if(user){
                    req.session.regenerate(function(){
                        req.session.user = user;
                        req.session.success = 'Authenticated as ' + user.email + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                         emailCri=user.email;
                        res.redirect('/userprofile');
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
    
    authenticate(req.body.email, req.body.password, function (err, user) {
        if (user) {
            req.session.regenerate(function () {
                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.email + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                res.redirect('/home');
                emailCri=user.email;
            });
        } else {
            res.redirect('/login');
            req.session.error = 'Authentication failed, please check your ' + ' email and password.';
            

        }
    });
});

app.get('/logout', function (req, res) {
    req.session.destroy(function () {
        res.redirect('/home');
    });
});

//join event
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

//get data from users to profile
app.get('/userprofile',function(req, res){
    
    if (req.session.user) {
        User.find({"email":emailCri},function(err,docs){
        res.render("users/userprofile", {users: docs,title: "Already Login"});
        console.log(docs);
    });
    } else {
        res.redirect('/home');
  
    }
});
//add profile
app.post('/userprofile',function(req,res){
    var a = req.body;
    new Profile({
        _id: a.emailaddress,
        FName: a.fullname,
        Address: a.address,
        Age: a.age,
        Gender: a.gender,
        EMail: a.emailaddress,
        Contact: a.contactnumber,

    }).save(function (err, users){
        if(err){
            res.send("Soorryyyy")
        }
        else{
        res.redirect('/home');
    }
});
});

app.get('/:user/profile',function (req, res){
    Profile.find({"EMail":emailCri}, function (err,xProfile){
        res.render('users/editprofile',{xProfile:xProfile})

    });//end of Profile.find

});// end of get user profile

app.post('/:user/profile',function (req, res){
    Profile.update(
    {
        _id: req.body.Email
    }, 
    {
        $set: {
            FName: req.body.FName,
            Address: req.body.Address,
            Age: req.body.Age,
            Gender: req.body.Gender,
            Contact: req.body.Contact
        }
    }, 
    function(err, updated) {
        if( err || !updated ) console.log("User not updated");
        else console.log("User updated");
    });
   console.log(req.body.Email);
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
