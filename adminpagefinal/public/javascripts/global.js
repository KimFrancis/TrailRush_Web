// Userlist data array for filling in info box
var userListData = [];


// DOM Ready =============================================================
$(document).ready(function(){  

    populateTable();
  });

 // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
 // start the update user process
    $('#userList table tbody').on('click', 'td a.linkupdateuser', changeUserInfo);
 // Add User button click
    $('#btnAddUser').on('click', addUser);
 // Search User button click
    $('#btnSearchUser').on('click', searchUser);
 // Generate QR Button Click
    $('#btnBack').on("click", back);
 // Cancel Update User button click
    $('#btnCancelUpdateUser').on('click', togglePanels);
    // Cancel Update User button click
 // Add class to updated fields
    $('#updateUser input').on('change', function(){$(this).addClass('updated')})
 // Update User button click
    $('#btnUpdateUser').on('click', updateUser);


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

    var eventid=$('#hiddenEvent').val();

    // jQuery AJAX call for JSON
    $.getJSON( '/event/' +eventid , function( data ) {
    // Stick our user data array into a userlist variable in the global object
    userListData = data;    
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.bibid + '</td>';
            tableContent += '<td><a href="#" class="linkupdateuser" rel="' + this.bibid + '" title="Show Details">' + this.fullname + '</a></td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">REMOVE</a></td>';
            tableContent += '</tr>';

            
        });


        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
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
            'contactnumber': $('#addUser fieldset input#inputUserContactNumber').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'address': $('#addUser fieldset input#inputUserAddress').val(),
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
                alert('Bib ID already exist. Please try again!');

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
            url: '/users/deleteuser/' + $(this).attr('rel')
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



// Search User Info
function searchUser(event) {


    // Prevent Link from Firing
    event.preventDefault();


    if($('#addUserPanel').is(":visible")){
    togglePanels();
     }

    var searchvariable = $('input#inputSearchName').val();
    console.log(searchvariable);
    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.bibid+''; }).indexOf(searchvariable);
    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    console.log(thisUserObject);
    //Populate Info Box
        $('#updateUserBibID').val(thisUserObject.bibid);
        $('#updateUserEvent').val(thisUserObject.event);
        $('#updateUserFullname').val(thisUserObject.fullname);
        $('#updateUserAge').val(thisUserObject.age);
        $('#updateUserEmail').val(thisUserObject.emailaddress);
        $('#updateUserContactNumber').val(thisUserObject.contactnumber);
        $('#updateUserAddress').val(thisUserObject.address);
        $('#updateUserGender').val(thisUserObject.gender);

    //Generate QR
    clearQR();
    var qrcode = new QRCode(document.getElementById("qrcode"), 
    {
    width : 250,
    height : 250
    });
  

    var name = document.getElementById('updateUserFullname').value;
    var bimp = document.getElementById('updateUserBibID').value;
    var TRevent= document.getElementById('updateUserEvent').value;

    document.getElementById('qrcode').value='{"FName":"'+name+'","bibid":"'+bimp+'","EventName":"'+TRevent+'"}';


    // alert(document.getElementById('qrvalue').value);


    var elText = document.getElementById('qrcode');

    qrcode.makeCode(elText.value);


    alert('Participant "' + thisUserObject.fullname +'" found!');

   
};


function clearQR()
{
    document.getElementById('qrcode').innerHTML = "";
}




//UPDATE USER CODES

  // put User Info into the 'Update User Panel'
function changeUserInfo(event) {
 
  event.preventDefault();
     // If the addUser panel is visible, hide it and show updateUser panel
  if($('#addUserPanel').is(":visible")){
    togglePanels();
  }


  // Get Index of object based on _id value
   var thisBibID = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { 
        return  arrayItem.bibid + '';

    }).indexOf(thisBibID);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];


  console.log(userListData);
  // Populate Info Box
  $('#updateUserBibID').val(thisUserObject.bibid);
  $('#updateUserEvent').val(thisUserObject.event);
  $('#updateUserFullname').val(thisUserObject.fullname);
  $('#updateUserAge').val(thisUserObject.age);
  $('#updateUserEmail').val(thisUserObject.emailaddress);
  $('#updateUserContactNumber').val(thisUserObject.contactnumber);
  $('#updateUserAddress').val(thisUserObject.address);
  $('#updateUserGender').val(thisUserObject.gender);

 //Generate QR
    clearQR();
    var qrcode = new QRCode(document.getElementById("qrcode"), 
    {
    width : 250,
    height : 250
    });
  
    var name = document.getElementById('updateUserFullname').value;
    var bimp = document.getElementById('updateUserBibID').value;
    var TRevent= document.getElementById('updateUserEvent').value;
    document.getElementById('qrcode').value='{"FName":"'+name+'","bibid":"'+bimp+'","EventName":"'+TRevent+'"}';

    // alert(document.getElementById('qrvalue').value);
    var elText = document.getElementById('qrcode');
    qrcode.makeCode(elText.value);



  // Put the userID into the REL of the 'update user' block

  $('#updateUser').attr('rel',thisUserObject._id);
};

function updateUser(event){

  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to update this user?');

  // Check and make sure the user confirmed
  if (confirmation === true) {
    // If they did, do our update
 
    //set the _id of the user to be update 
    var _id = $(this).parentsUntil('div').parent().attr('rel');

      
    //create a collection of the updated fields
    var fieldsToBeUpdated = $('#updateUser input.updated');
      
    //create an object of the pairs
    var updatedFields = {};
    $(fieldsToBeUpdated).each(function(){
        var key = $(this).attr('placeholder').replace(" ","").toLowerCase();
        var value = $(this).val();
        updatedFields[key]=value;
    })
    console.log(updatedFields);
    // do the AJAX
    $.ajax({
      type: 'PUT',
      url: '/users/updateuser/' + _id,
      data: updatedFields
    }).done(function( response ) {

      // Check for a successful (blank) response
      if (response.msg === '') {
                alert('Sucessfully Updated!');
                togglePanels();
                    }
      else {
        alert('Bib ID already exist. Please try again!');
      }
      // Update the table
      populateTable();

    });

  }
  else {

    // If they said no to the confirm, do nothing
    return false;

  }


  }


function back() {
    window.location = 'http://localhost:3001/admin/event';
}

