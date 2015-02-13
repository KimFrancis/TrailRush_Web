var express = require('express');
var router = express.Router();



/*
 * GET stats.
 */
router.get('/stats', function(req, res) {
    var db = req.db;
    db.collection('stats').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    db.collection('participants').find().toArray(function (err, items) {
        res.json(items);
    });
});



/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
    var db = req.db;
    db.collection('participants').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});


/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var userToDelete = req.params.id;
    db.collection('participants').removeById(userToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

router.put('/updateuser/:id', function(req, res) {
    var db = req.db;
    var userToUpdate = req.params.id;
    // var dataToUpdate = {
    //     bibid: req.body.username,
    //     event1: req.body.event1,
    //     fullname: req.body.fullname,
    //     age: req.body.age,
    //     location: req.body.location,
    //     gender: req.body.gender,
    // }
    var doc = { $set: req.body};

    db.collection('participants').updateById(userToUpdate,doc,function(err, result) {
    console.log(err);
      res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });

});

/*
 * PUT to updateuser.
 */
exports.updateuser = function(db) {
  return function(req, res) {
    var userToUpdate = req.params.id;
      var doc = { $set: req.body};
    db.collection('userlist').updateById(userToUpdate, doc ,function(err, result) {
      res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
  }
};

module.exports = router;