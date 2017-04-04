'use strict'

var fs = require('fs')
var path = require('path')

// Loads all .js files in this directory (other than index.js) and registers the contained command
module.exports = function loader (program) {
  'use strict'

  var commands = {}
  var loadPath = path.dirname(__filename)

  // Loop though command files
  fs
    .readdirSync(loadPath)
    .filter(function (filename) {
      return (/\.js$/.test(filename) && filename !== 'index.js')
    })
    .forEach(function (filename) {
      // Requiring command file returns function
      var commandFn = require(path.join(loadPath, filename))

      commandFn(program)
    })

  return commands
}
