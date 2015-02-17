// Userlist data array for filling in info box
var userListData = [];





// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();


});

 // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
 // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

// Functions =============================================================
// Toggle addUser and updateUser panels
function togglePanels(){
    $('#addUserPanel').toggle();
    $('#updateUserPanel').toggle();
  }


// Fill table with data
function populateTable() {


    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/event', function( data ) {
    // Stick our user data array into a userlist variable in the global object
    userListData = data;    
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkupdateuser" rel="' + this._id + '" title="Show Details">' + this.EventName + '</a></td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">REMOVE</a></td>';
            tableContent += '</tr>';
        });


        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisBibID = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { 
        return  arrayItem.bibid + '';

    }).indexOf(thisBibID);

    console.log(arrayPosition);
    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoBibID').val(thisUserObject.bibid);
    $('#userInfoName').val(thisUserObject.fullname);
    $('#userInfoEvent').val(thisUserObject.event);
    $('#userInfoEmail').val(thisUserObject.emailaddress);
    $('#userInfoContactNum').val(thisUserObject.contactnumber);
    $('#userInfoGender').val(thisUserObject.gender);
    $('#userInfoAge').val(thisUserObject.age);
    $('#userInfoAddress').val(thisUserObject.address);

    //Generate QR
    clearQR();
    var qrcode = new QRCode(document.getElementById("qrcode"), 
    {
    width : 250,
    height : 250
    });
  
    var name = document.getElementById('userInfoName').value;
    var bimp = document.getElementById('userInfoAge').value;
    var TRevent= document.getElementById('userInfoEvent').value;
    document.getElementById('qrcode').value='{"Name":"'+name+'","Bib":"'+bimp+'","event":"'+TRevent+'"}';

    // alert(document.getElementById('qrvalue').value);
    var elText = document.getElementById('qrcode');
    qrcode.makeCode(elText.value);


};

// Add User
function addUser(event,name,age, callback) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object


        var newUser = {
            'bibid': $('#addUser fieldset input#inputUserBibID').val(),
            'event': $('#addUser fieldset input#inputUserEvent').val(),
            'emailaddress': $('#addUser fieldset input#inputUserEmail').val(),
            'contactnumber': $('#addUser fieldset input#inputUserContactNum').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'address': $('#addUser fieldset input#inputUseraddress').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }
        console.log(newUser);

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }


}


// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this driver?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteevent/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};


