var userListData = [];



// create a new javascript Date object based on the timestamp
// multiplied by 1000 so that the argument is in milliseconds, not seconds
var unix_timestamp = '1423725896';

var date = new Date(unix_timestamp*1000);
// hours part from the timestamp
var hours = date.getHours();
// minutes part from the timestamp
var minutes = "0" + date.getMinutes();
// seconds part from the timestamp
var seconds = "0" + date.getSeconds();
//will display time in 10:30:23 format
var formattedTime = hours + ':' + minutes.substr(minutes.length-2) + ':' + seconds.substr(seconds.length-2);

function validate(){
console.log(formattedTime);
console.log(date);
console.log(Date());
// console.log(unixtime);
};

