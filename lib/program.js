'use strict'

var program = require('commander')

var appRoot = require('./config').appRoot
var logger = require('./logger')
var packageJson = require(appRoot + '/package.json')

module.exports = getProgram()

function getProgram () {
  program.on('*', function () {
    logger.errorMessage('Unknown Command', '"' + program.args.join(' ') + '"')
    program.help()
  })

  // Return program bootstrapped with package.json version
  return program
    .version(packageJson.version)
}
