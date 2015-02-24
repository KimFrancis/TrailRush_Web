// Userlist data array for filling in info box
var userListData1 = [];





// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();


});

 // Username link click
    // $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
 // Delete User link click
    $('#userList1 table tbody').on('click', 'td a.linkdeleteevent', deleteEvent);
 // start the update user process
    $('#userList1 table tbody').on('click', 'td a.linkupdateevent', changeEventInfo);
 // Add User button click
    $('#btnAddEvent').on('click', addEvent);
 // Cancel Update User button click
    $('#btnCancelUpdateEvent').on('click', togglePanels);
 // Add class to updated fields
    $('#updateEvent input').on('change', function(){$(this).addClass('updated')})
 // Update User button click
    $('#btnUpdateEvent').on('click', updateEvent);


// Functions =============================================================
// Toggle addUser and updateUser panels
function togglePanels(){
    $('#btnAddEvent').toggle();
    $('#updateEventPanel').toggle();
  }


// Fill table with data
function populateTable() {


    // Empty content string
    var tableContent = '';

    var eventname=$('#hiddenEvent').val();

    // jQuery AJAX call for JSON
    $.getJSON( '/event', function( data ) {
    // Stick our user data array into a userlist variable in the global object
    userListData1 = data;    
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="http://localhost:3000/admin/event/'+this._id+'" rel="' + this._id + '" title="Show Details">' + this.EventName + '</a></td>';
            tableContent += '<td><a href="#" class="linkupdateevent" rel="' + this.EventName + '">EDIT</a></td>';
            tableContent += '<td><a href="#" class="linkdeleteevent" rel="' + this._id + '">REMOVE</a></td>';
            tableContent += '</tr>';

            
        });


        // Inject the whole content string into our existing HTML table
        $('#userList1 table tbody').html(tableContent);
    });
};


// Add User
function addEvent(event) {
  window.location= 'http://192.168.1.16:3001/admin/event/addEvent'
}

// Delete User
function deleteEvent(event) {

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





//UPDATE USER CODES

  // put User Info into the 'Update User Panel'
function changeEventInfo(event) {
 
  event.preventDefault();
     // If the addUser panel is visible, hide it and show updateUser panel
  if($('#btnAddEvent').is(":visible")){
    togglePanels();
  }


  // Get Index of object based on _id value
   var thiseEventName= $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData1.map(function(arrayItem) { 
        return  arrayItem.EventName + '';

    }).indexOf(thiseEventName);

    // Get our User Object
    var thisUserObject = userListData1[arrayPosition];

  console.log(userListData1);
  // Populate Info Box
  $('#updateUserEventName').val(thisUserObject.EventName);
  $('#updateUserEventStatus').val(thisUserObject.EventStatus);
  $('#updateUserEventOrganizer').val(thisUserObject.EventOrganizer);
  $('#updateUserEventStations').val(thisUserObject.EventStations);
  $('#updateUserEventPlace').val(thisUserObject.EventPlace);
  $('#updateUserEventDate').val(thisUserObject.EventDate);
  $('#updateUserEventDescription').val(thisUserObject.EventDescription);

   // Put the userID into the REL of the 'update user' block

  $('#updateEvent').attr('rel',thisUserObject._id);
};

function updateEvent(event){

  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to update this user?');

  // Check and make sure the user confirmed
  if (confirmation === true) {
    // If they did, do our update
 
    //set the _id of the user to be update 
    var _id = $(this).parentsUntil('div').parent().attr('rel');

      
    //create a collection of the updated fields
    var fieldsToBeUpdated = $('#updateEvent input.updated');
      
    //create an object of the pairs
    var updatedFields = {};
    $(fieldsToBeUpdated).each(function(){
        var key = $(this).attr('placeholder').replace(" ","");
        var value = $(this).val();
        updatedFields[key]=value;
    })
    console.log(updatedFields);
    // do the AJAX
    $.ajax({
      type: 'PUT',
      url: '/users/updateevent/' + _id,
      data: updatedFields
    }).done(function( response ) {

      // Check for a successful (blank) response
      if (response.msg === '') {
              togglePanels();
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
  }
