'use strict'

var fs = require('fs')
var exec = require('child_process').exec
var ipc = require('electron').ipcRenderer
var mockService = require('./mockit.service')
var { pubsub } = require('./pub-sub.service')
var { sidebarComp } = require('./sidebar')
var monaco = require('./monaco')

// INITIALIZE
let portInput = document.querySelector('#port')
let port = portInput.value

monaco.initializeEditor()
sidebarComp.createEndPointBtns(port)
// END INITIALIZE

ipc.on('data-loaded', dataLoaded)

function dataLoaded(event, data) {
  console.warn('dataLoaded:: triggered on fetch, app load and simulate-scan', data);
}

var btn = document.getElementById('clicker')
btn.onclick = simulateScan

function simulateScan() {
  ipc.send('simulate-scan');
}

// STATUS
function setApiStatus() {
  var statusEl = document.querySelector('#apiStatus')
  if(serverStarted) {
    statusEl.innerHTML = 'active'
  } else {
    statusEl.innerHTML = 'inactive'
  }
}


// we need to allow for MVP of one file to use
// this will save locally to use
// errors we will need messaging. But we can check when the app launches and notify with a prompt
let portPID
let serverStarted = false
let start = document.querySelector('#start')
start.onclick = function() {
  if(serverStarted) {
    alert('the server is already running')
    return
  }

  let startProcess = exec(`json-server --watch db.json --port ${port}`, (err, stdout, stderr) => {
    // console.warn('RUNNING', err)
    // console.warn('RUNNING', stdout)
    // console.warn('RUNNING', stderr)
    if (err) {
      throw err
      return
    }
  })
  // NOTE: This gets lost on reload!
  // Off load this to the main process and track inside of Electron
  console.warn('startProcess:: PID', startProcess.pid)
  portPID = startProcess.pid
  serverStarted = true
  setApiStatus()
}

// PID is set as a global variable
let end = document.querySelector('#end')
end.onclick = function() {
  exec(`kill -9 ${portPID}`, (err, stdout, stderr) => {
    // console.warn('RUNNING', err)
    // console.warn('RUNNING', stdout)
    // console.warn('RUNNING', stderr)
  })
  serverStarted = false
  setApiStatus()
}
