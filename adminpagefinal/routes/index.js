var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/admin/event', function(req, res, next) {
  res.render('admin_event', { title: 'Express' });
});

router.get('/admin/runner', function(req, res, next) {
  res.render('admin_runner', { title: 'Express' });
});




module.exports = router;
