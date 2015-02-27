var express = require('express');
var router = express.Router();


// Add Participant
router.post('/adduser', function(req, res) {
    var db = req.db;
    db.collection('participants').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

// DELETE Participant
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var userToDelete = req.params.id;
    db.collection('participants').removeById(userToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

//Delete Event
router.delete('/deleteevent/:id', function(req, res) {
    var db = req.db;
    var userToDelete = req.params.id;
    db.collection('myevents').removeById(userToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

//Update Participant
router.put('/updateuser/:id', function(req, res) {
    var db = req.db;
    var userToUpdate = req.params.id;
    var doc = { $set: req.body};
    console.log(doc);
    db.collection('participants').updateById(userToUpdate,doc,function(err, result) {
      res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });

});

//Update Event
router.put('/updateevent/:id', function(req, res) {
    var db = req.db;
    var userToUpdate = req.params.id;
    var doc = { $set: req.body};

    db.collection('myevents').updateById(userToUpdate,doc,function(err, result) {
    console.log(err);
      res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });

});


module.exports = router;