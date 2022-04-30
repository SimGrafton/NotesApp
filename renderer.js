'use strict'

window.$ = window.jQuery = require('jquery')
window.Tether = require('tether')
window.Bootstrap = require('bootstrap')

const ipc = require('electron').ipcRenderer;

var globalWindowSize; 

var globalUserPath; 

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

function GetHomePath()
{
  ipc.send(`getDesktopPath`);
}

ipc.on('pathy', function (evt, pathy) {
  globalUserPath = pathy; 
});

function OpenDevTools()
{
  ipc.send(`openDevTools`);
}

function OpenFileDialog()
{
  ipc.send(`getFileDialog`);
}

ipc.on('imageFileSelectResult', function (evt, result) {
  if(result == "error")
  {
    console.log("error with user selecting file"); 
  }
  else{
    CopyImageToImageDir(result); 
  }
});
