'use strict'

window.$ = window.jQuery = require('jquery')
window.Tether = require('tether')
window.Bootstrap = require('bootstrap')

const ipc = require('electron').ipcRenderer;


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
