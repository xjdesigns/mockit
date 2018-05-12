'use strict'

var ipc = require('electron').ipcRenderer;
var io = require('socket.io-client');
var socket = io('http://localhost:7003');

ipc.on('data-loaded', dataLoaded)

function dataLoaded(event, data) {
  console.warn('dataLoaded:: triggered on fetch, app load and simulate-scan', data);
}

var btn = document.getElementById('clicker')
btn.onclick = simulateScan

function simulateScan() {
  ipc.send('simulate-scan');

  var msg = 'I came from my simulator app';
  socket.emit('device:sim', msg)
}

socket.on('device:sim', function(msg) {
  console.warn('this works, I am INDEX JS');
})
