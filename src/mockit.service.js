var fs = require('fs')

var readFile = () => {
  return new Promise((res, rej) => {
    fs.readFile('./data/data.json', 'utf8', (err, data) => {
      if(err) {
        throw err
        rej(err)
      }
      console.warn('data', data)
      res(data)
    })
  })
}

var writeFile = (contents) => {
  fs.writeFile('./data/data.json', contents, function(err) {
    if(err) {
      throw err
      return 'Error saving data'
    }
    console.warn('writing callback:: error passed if one exists', err)
  })
}

exports.writeFile = writeFile
exports.readFile = readFile
