'use strict'

module.exports = (req, res, next) => {
  // console.warn('middelware req', req)
  console.warn('middelware res', req.body)
  console.warn('middelware next is a method')
  next()
}
