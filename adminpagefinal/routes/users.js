var express = require('express');
var router = express.Router();


/*
 * GET userlist.
 */

// router.get('/userlist/:id', function(req, res) {
//     var db = req.db;
//     db.collection('participants').find({'EventName':req.params.id}).toArray(function (err, items) {
//         res.json(items);
//     });
// });

// router.get('/userlist/', function(req, res) {
//     var db = req.db;
//     db.collection('participants').find().toArray(function (err, items) {
//         res.json(items);
//     });
// });

// router.get('/event', function(req, res) {
//     var db = req.db;
//     db.collection('myevents').find().toArray(function (err, items) {
//         res.json(items);
//     });
// });

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

router.delete('/deleteevent/:id', function(req, res) {
    var db = req.db;
    var userToDelete = req.params.id;
    db.collection('myevents').removeById(userToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});


router.put('/updateuser/:id', function(req, res) {
    var db = req.db;
    var userToUpdate = req.params.id;
    var doc = { $set: req.body};
    console.log(doc);
    db.collection('participants').updateById(userToUpdate,doc,function(err, result) {
    console.log(err);
      res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });

});

router.put('/updateevent/:id', function(req, res) {
    // var dataToUpdate = {
    //     EventStatus: req.body.EventStatus,
    //     EventName: req.body.EventName,
    //     EventStations: req.body.EventStations,
    //     EventDescription: req.body.EventDescription,
    //     EventOrganizer: req.body.EventOrganizer,
    //     EventPlace: req.body.EventPlace,
    //     EventDate: req.body.EventDate
    // };
    var db = req.db;
    var userToUpdate = req.params.id;
    var doc = { $set: req.body};

    db.collection('myevents').updateById(userToUpdate,doc,function(err, result) {
    console.log(err);
      res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });

});

/*
 * PUT to updateuser.
 */
// exports.updateuser = function(db) {
//   return function(req, res) {
//     var userToUpdate = req.params.id;
//       var doc = { $set: req.body};
//     db.collection('participants').updateById(userToUpdate, doc ,function(err, result) {
//       res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
//     });
//   }
// };

module.exports = router;