var express = require('express');
var router = express.Router();



/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/admin/event', function(req, res, next) {
  res.render('admin_event', { title: 'Express' });
});

router.get('/admin/event/:id', function(req, res, next) {
var eventId = req.params.id;
res.render('admin_runner', 
					{ 
	        			title: 'Express', 
	        			eventID: eventId
	        		});	
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/admin/runner', function(req, res) {
    var db = req.db;
    db.collection('participants').find().toArray(function (err, items) {
        res.json(items);
    });
});

router.get('/event/:id', function(req, res) {
    var db = req.db;
    db.collection('participants').find({'EventName':req.params.id}).toArray(function (err, items) {
        res.json(items);
    });
});

router.get('/event', function(req, res) {
    var db = req.db;
    db.collection('myevents').find().toArray(function (err, items) {
        res.json(items);
    });
});


module.exports = router;
