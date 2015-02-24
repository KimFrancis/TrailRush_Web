var unix_timestamp = time;

console.log(unix_timestamp);
var date = new Date(unix_timestamp*1000);
// hours part from the timestamp
var hours = date.getHours();
// minutes part from the timestamp
var minutes = "0" + date.getMinutes();
// seconds part from the timestamp
var seconds = "0" + date.getSeconds();
//will display time in 10:30:23 format
var formattedTime = hours + ':' + minutes.substr(minutes.length-2) + ':' + seconds.substr(seconds.length-2);

/*function validate(){
console.log(formattedTime);
console.log(date);
console.log(Date());
// console.log(unixtime);
};*/