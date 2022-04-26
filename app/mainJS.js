const {BrowserWindow} = require('electron');

// Context menu for the close button

$(`#closeBtn`).contextmenu(DisplayCloseContextMenu); 

function DisplayCloseContextMenu(e){


    // Set position of menu to mouse click
    var posX = e.clientX;
    var posY = e.clientY;

    $(`#menu`).html(""); // refresh the context menu
    menu(posX, posY);
    e.preventDefault();

    $('#menu').css('z-index', 9999); 

    $(`#menu`).append(`<a href="#" id="btnShowDevTools"><img src="icons/icons8-edit-50.png" />Show Dev Tools</a>`);
    $(`#btnShowDevTools`).click(OpenDevTools); 

}
