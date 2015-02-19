// Userlist data array for filling in info box
var userListData = [];





// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();


});

 // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
 // Add User button click
    $('#btnAddEvent').on('click', addEvent);

// Functions =============================================================
// Fill table with data
function populateTable() {


    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/event', function( data ) {
    // Stick our user data array into a userlist variable in the global object
    userListData = data;    
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="http://localhost:3000/admin/event/'+this._id+'" rel="' + this._id + '" title="Show Details">' + this.EventName + '</a></td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">REMOVE</a></td>';
            tableContent += '</tr>';
        });


        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Add User
function addEvent() {
    window.location = 'http://192.168.1.15:3001/admin/event/addevent';
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


