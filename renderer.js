'use strict'

window.$ = window.jQuery = require('jquery')
window.Tether = require('tether')
window.Bootstrap = require('bootstrap')

const ipc = require('electron').ipcRenderer;

var globalWindowSize; 


// Messages to main
// Minimise Button
$('.minBtn').on('click', e => {
    ipc.send('min'); 
  })

  // Close button
$('.closeBtn').on('click', e => {
    ipc.send('close');
  })

// Full Screen button
$(`.maxBtn`).on(`click`, e => {
    ipc.send(`max`); 
  })

// Reload app button
$(`.reloadBtn`).on(`click`, e => {
  ipc.send(`reload`); 
})

function GetWindowSize()
{
  ipc.send(`getSize`); 
}

ipc.on('asynchronous-message', function (evt, message) {
  globalWindowSize = message; 
});

function FocusWindow()
{
  console.log("focussing");
  ipc.send(`focusWindow`); 
}
