const jsonServer = require('json-server')
const server = jsonServer.create()
const server1 = jsonServer.create()
const router = jsonServer.router('db.json')
const router1 = jsonServer.router('db1.json')
const middlewares = jsonServer.defaults()
const delay = require('express-delay')
const newMiddle = require('./middleware')

// default middleware
server.use(middlewares)

// custom middleware
// server.use(newMiddle)

// delay responses for timing checks
server.use(delay(3000))

server.use('/api', router)
server.listen(7001, () => {
  console.log('JSON Server is running')
})

// override render of the data
router.render = (req, res) => {
  res.jsonp({
    body: res.locals.data
  })
}

// another end point
server1.use(newMiddle)

// delay responses for timing checks
server1.use(delay(3000))

server1.use('/api', router1)
server1.listen(7002, () => {
  console.log('JSON Server is running')
})

// override render of the data
router1.render = (req, res) => {
  res.jsonp({
    body: res.locals.data
  })
}

// create an io socket to listen for the port
// or electrom app is running on
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/src/index.html');
});

var connections = [];
io.on('connection', function(socket){
  connections.push(socket);
  console.log('a user connected', connections.length);

  socket.on('disconnect', function(socket) {
    connections.splice(connections.indexOf(socket, 1))
    console.log('user disconnected', connections.length);
  })

  socket.on('device:sim', function(msg) {
    console.log('this is a msg from react app::', msg)
    io.emit('device:sim', msg);
  })
});

http.listen(7003, function(){
  console.log('IO listening on *:7003');
});
