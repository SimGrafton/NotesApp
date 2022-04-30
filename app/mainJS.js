const {BrowserWindow} = require('electron');

// Context menu for the close button

$(`#closeBtn`).contextmenu(OpenDevTools); 

// No longer using
// function DisplayCloseContextMenu(e){


//     // Set position of menu to mouse click
//     var posX = e.clientX;
//     var posY = e.clientY;

//     $(`#menu`).html(""); // refresh the context menu
//     menu(posX, posY);
//     e.preventDefault();

//     $('#menu').css('z-index', 9999); 

//     $(`#menu`).append(`<a href="#" id="btnShowDevTools"><img src="icons/icons8-edit-50.png" />Show Dev Tools</a>`);
//     $(`#btnShowDevTools`).click(OpenDevTools); 

// }


// $(".changeNotesDirBtn").click(ChangeFileDirectoryButton); 

// function ChangeFileDirectoryButton()
// {
//     // Get the current location of the files
//     console.log(globalSettings);

//     // Set and output box next to button on same row. Include the current location

//     // On submit event listener

//     // Check that the file directory is valid and has read/ write access

//     // Change the file directory in settings file

//     // Load the folders in the new location

//     // Copy the files into the new location

//     // 
// }

