// Below function Executes on click of login button.
function validate(){
var username = document.getElementById("username").value;
var password = document.getElementById("password").value;
if ( username == "admin" && password == "admin"){
alert ("Login successfully");
window.location = 'http://localhost:3001/admin/event'; // Redirecting to admin page.
return false;
}
else{// Decrementing by one.
alert("Login Error! Try Again!");
// Disabling fields after 3 attempts.

}
}