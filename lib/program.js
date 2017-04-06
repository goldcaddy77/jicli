'use strict'

var appRoot = require('app-root-path').path
var program = require('commander')

var logger = require('./logger')

// Always load package.json from app root (including when run globally)
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
