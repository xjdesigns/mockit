// NOTE: This is moved to public for CRA and Electron Builder
// ./main.js
const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const fetch = require('node-fetch')

let win = null;

app.on('ready', function () {

  // Initialize the window to our specified dimensions
  win = new BrowserWindow({
    width: 1600,
    height: 1000,
    // titleBarStyle: 'customButtonsOnHover',
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Specify entry point
  const startUrl = process.env.ELECTRON_START_URL || url.format({
      pathname: path.join(__dirname, '/src/index.html'),
      protocol: 'file:',
      slashes: true
  });
  win.loadURL(startUrl);

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  // Show dev tools
  // Remove this line before distributing
  win.webContents.openDevTools()

  // Remove window once app is closed
  win.on('closed', function () {
    win = null;
  });
});

ipcMain.on('simulate-scan', function() {
  fetch('http://localhost:7001/api/posts')
    .then(res => res.json())
    .then(json => {
      console.warn('json res', json);
      win.webContents.send('data-loaded', json)
    })
    .catch((err) => {
      console.warn('err from fetch:: please start the json-server file but running node json-server');
    })
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// Main Menu
const mainMenuTemplate = [{
  label: app.getName(),
  submenu: [{
    label: 'File',
    accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
    click() {
      app.quit();
    }
  }]
},
{
  label: 'Accessibility',
  submenu: [
    { role: 'startspeaking' },
    { role: 'stopspeaking' }
  ]
}];

// MacOS fix for Electron menu
if(process.platform === 'darwin') {
  mainMenuTemplate.unshift({});
}

// Devtools
if(process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Dev',
    submenu: [
      { role: 'reload' },
      { role: 'toggledevtools'},
      { role: 'togglefullscreen' }
    ]
  });
}
