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
