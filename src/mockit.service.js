const fs = require('fs')

const dataFile = 'db.json'

const readFile = () => {
  return new Promise((res, rej) => {
    fs.readFile(`${dataFile}`, 'utf8', (err, data) => {
      if(err) {
        throw err
        rej(err)
      }
      res(data)
    })
  })
}

const writeFile = contents => {
  fs.writeFile(`${dataFile}`, contents, function(err) {
    if(err) {
      throw err
      return 'Error saving data'
    }
    console.warn('writing callback:: error passed if one exists', err)
  })
}

const parseDataForEditing = (data) => {
  let endObj = {}
  let keys = Object.keys(data)
  let len = keys.length
  for (let i = 0; i < len; i++) {
    endObj[keys[i]] = data[keys[i]]
  }
  return endObj
}

exports.writeFile = writeFile
exports.readFile = readFile
exports.parseDataForEditing = parseDataForEditing
