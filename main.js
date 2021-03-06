'use strict'

const { ipcMain } = require('electron');
const electron = require('electron')
const app = electron.app
const globalShortcut = electron.globalShortcut
const os = require('os')
const path = require('path')
const config = require(path.join(__dirname, 'package.json'))
const BrowserWindow = electron.BrowserWindow

const { dialog } = require('electron'); 

//app.setName(config.productName)
var mainWindow = null;

var pathy = app.getPath('home');

app.on('ready', function () {
  mainWindow = new BrowserWindow({
    frame: false,
    minWidth: 800,
    autoHideMenuBar: true,
    backgroundColor: 'lightgray',
    title: config.productName,
    show: false,
    icon: `${__dirname}/NotesAppIcon.ico`, 
    webPreferences: {
      nodeIntegration: true,
      defaultEncoding: 'UTF-8',
      contextIsolation: false, // protect against prototype pollution
      worldSafeExecuteJavaScript: true,
      /* See https://stackoverflow.com/questions/63427191/security-warning-in-the-console-of-browserwindow-electron-9-2-0 */
      enableRemoteModule: false,
      preload: path.join(app.getAppPath(), 'preload.js')
    }
  })

  // Open dev tools
  //mainWindow.webContents.openDevTools();

  // Load html
  mainWindow.loadURL(`file://${__dirname}/app/index.html`)

  mainWindow.once('ready-to-show', () => {
    //mainWindow.setMenu(null)
    mainWindow.show(); 
  })

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  // Minimise button
  ipcMain.on('min', () => {
    mainWindow.minimize(); 
  })

  // Close button
  ipcMain.on('close', () => {
    mainWindow.close(); 
  })

  // max button
  ipcMain.on('max', () => {
    mainWindow.maximize(); 
  })

  // reload button
  ipcMain.on('reload', () => {
    mainWindow.reload(); 
  })

  // GetSize
  ipcMain.on('getSize', () => {
    mainWindow.webContents.send('asynchronous-message', mainWindow.getSize());
  })

  // Focus on main window
  ipcMain.on('focusWindow', () => {
    mainWindow.focus(); 
  })

  // Get Path of Desktop
  ipcMain.on('getDesktopPath', () => {
    mainWindow.webContents.send('pathy', pathy);
  })

  // Open dev tools
  ipcMain.on('openDevTools', () => {
    mainWindow.webContents.openDevTools();
  })

  ipcMain.on('getFileDialog', () => {
    
    dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [  { name: 'Images', extensions: ['jpg', 'png', 'gif', 'jpeg'] }   ]
    }).then(result => {
      mainWindow.webContents.send('imageFileSelectResult', result);
    }).catch(err => {
      mainWindow.webContents.send('imageFileSelectResult', `error`);
    })

  })

})

app.on('window-all-closed', () => { app.quit() })
