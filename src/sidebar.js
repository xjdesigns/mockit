const mockService = require('./mockit.service')
const { pubsub } = require('./pub-sub.service')

let sidebarComp = {
  selected: 'users',
  isActive: false,
  currentPort: null,

  selectPort: function(portName) {
    this.selected = portName || 'none'
  },

  createNewEndpoint: createNewEndpoint,
  createEndPointBtns: createEndPointBtns,
  selectNewPort: selectNewPort
}


// this is not working as expected.
// this is throwing errors... look into this
let newEndpoint = document.querySelector('#createNewEndpoint')
newEndpoint.onclick = createNewEndpoint.bind(this)
function createNewEndpoint() {
  let newEndpointInput = document.querySelector('#newEndpointInput')
  let val = newEndpointInput.value
  let newDataset
  mockService.readFile().then(data => {
    newDataset = JSON.parse(data)
    newDataset[val] = {}

    let dataString = JSON.stringify(newDataset, null, '  ')
    mockService.writeFile(dataString)
    createEndPointBtns(this.sidebarComp.currentPort)
  })
}

let listing = document.querySelector('#endpoints')
listing.onclick = selectNewPort

function selectNewPort(ev) {
  let port = ev.target.dataset.id
  pubsub.publish('portChanged', port)
}

// resetting this has an issue due to the parse and stringify when saving
function createEndPointBtns(port) {
  let self = this
  this.currentPort = port
  let docFrag = document.createDocumentFragment()
  mockService.readFile().then(data => {
    let div = document.createElement('div')
    let endpoint = document.querySelector('#endpoints')
    endpoint.innerHTML = ''
    data = JSON.parse(data)
    Object.keys(data).forEach((key) => {
      let btn = document.createElement('button')
      btn.classList.add('sidebar-action')
      btn.innerHTML = `localhost://${port}/${key}`
      btn.setAttribute('data-id', `${key}`)
      docFrag.appendChild(btn)
    })
    div.appendChild(docFrag)
    endpoint.appendChild(div)
  })
}

exports.sidebarComp = sidebarComp
