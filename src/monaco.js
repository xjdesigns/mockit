const loader = require('monaco-loader')
const mockService = require('./mockit.service')
const { sidebarComp } = require('./sidebar')
const { pubsub } = require('./pub-sub.service')

// MONACO EDITOR
let uriTracking = {}
let uri
const initializeEditor = () => {
  loader().then(monaco => {
    let editor = monaco.editor.create(document.querySelector('#editor'), {
      language: 'json',
      theme: 'vs-dark',
      automaticLayout: true
    })
    editor.model.updateOptions({ tabSize: 2 })

    let selectedPort
    mockService.readFile().then((data) => {
      selectedPort = sidebarComp.selected
      data = setMonacoData(data, selectedPort)
      editor.model.setValue(JSON.stringify(data, null, '  '))

      uri = editor.model.uri
      uriTracking[selectedPort] = uri
    })
  })
  setupPortListener()
}

const setupPortListener = () => {
  pubsub.subscribe('portChanged', (newPort) => {
    let currentPort = sidebarComp.selected
    let editor = monaco.editor.getModel(uriTracking[currentPort])
    sidebarComp.selectPort(newPort)

    let selectedPort
    mockService.readFile().then((data) => {
      selectedPort = sidebarComp.selected
      data = setMonacoData(data, selectedPort)
      editor.setValue(JSON.stringify(data, null, '  '))

      uri = editor.uri
      uriTracking[selectedPort] = uri
    })
  })
}

// NODE READ/WRITE
var writeDoc = document.querySelector('#writeFile')
writeDoc.onclick = function() {
  loader().then(monaco => {
    let contents = monaco.editor.getModel(uri).getValue()
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

// GETTERS/SETTERS
// NOTE: For this I need to create models but keep track of them, maybe not even keep track but
// create and destroy them, to clean up memory but if there tabs then we need to keep track
// key/value pair might be the way to go since I will keep track of that
var setMonacoData = (data, selected) => {
  let endpoints = mockService.parseDataForEditing(JSON.parse(data))
  return endpoints[selected]
}

exports.initializeEditor = initializeEditor
