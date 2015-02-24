
/*
 * GET users listing.
 */
 var mongoose=require('mongoose');
//dbase
mongoose.connect('mongodb://admin:admin@ds041831.mongolab.com:41831/trailrush');

var MyStatsSchema = new mongoose.Schema({
  FName: String
  ,bibid: Number
  ,EventName: String
  ,Date: Number
  ,Station: String
});

var stats=mongoose.model('stats', MyStatsSchema);
exports.list = function(req, res){
stats.aggregate({ 
	$sort : { 
			"Station" : -1
		} 
	},
	{ $match: 
		{ "EventName": "ColorFunRun2015" 
	} 
	},
	{
		$group : {
		_id : "$FName"
		,Station: {
			$addToSet: "$Station"
		}
		,Date: {
			$addToSet: "$Date"
		}
	}
},
function (err, docs){
	console.log(docs);
	res.render('users/table', {users: docs});
});
};



