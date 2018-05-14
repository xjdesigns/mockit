'use strict'

var fs = require('fs')
var exec = require('child_process').exec
var ipc = require('electron').ipcRenderer;
var mockService = require('./mockit.service')

ipc.on('data-loaded', dataLoaded)

function dataLoaded(event, data) {
  console.warn('dataLoaded:: triggered on fetch, app load and simulate-scan', data);
}

var btn = document.getElementById('clicker')
btn.onclick = simulateScan

function simulateScan() {
  ipc.send('simulate-scan');
}


// we need to allow for MVP of one file to use
// this will save locally to use
// errors we will need messaging. But we can check when the app launches and notify with a prompt
var portPID
var serverStarted = false
var start = document.querySelector('#start')
start.onclick = function() {
  if(serverStarted) {
    console.warn('the server is already running')
    return
  }
  var startProcess = exec('json-server --watch ./data/data.json --port 3004', (err, stdout, stderr) => {
    console.warn('RUNNING', err)
    console.warn('RUNNING', stdout)
    console.warn('RUNNING', stderr)
    if (err) {
      throw err
      return
    }
  })
  console.warn('startProcess:: PID', startProcess.pid)
  portPID = startProcess.pid
  serverStarted = true
}

// PID is set as a global variable
var end = document.querySelector('#end')
end.onclick = function() {
  exec(`kill -9 ${portPID}`, (err, stdout, stderr) => {
    console.warn('RUNNING', err)
    console.warn('RUNNING', stdout)
    console.warn('RUNNING', stderr)
  })
  serverStarted = false
}

// MONACO EDITOR
const loader = require('monaco-loader')
var uri
loader().then(monaco => {
  let editor = monaco.editor.create(document.querySelector('#editor'), {
    language: 'json',
    theme: 'vs-dark',
    automaticLayout: true
  })
  editor.model.updateOptions({ tabSize: 2 })
  mockService.readFile().then((data) => {
    editor.model.setValue(data)
  })
  uri = editor.model.uri
})

// NODE READ/WRITE
var writeDoc = document.querySelector('#writeFile')
writeDoc.onclick = function() {
  loader().then(monaco => {
    let contents = monaco.editor.getModel(uri).getValue()
    console.warn('contents::', contents)
    mockService.writeFile(contents)
  })
}

var readDoc = document.querySelector('#readFile')
readDoc.onclick = function() {
  loader().then(monaco => {
    let editor = monaco.editor.getModel(uri)
    mockService.readFile().then((data) => {
      editor.setValue(data)
    })
  })
}
