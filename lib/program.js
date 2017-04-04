'use strict'

var chalk = require('chalk')
var program = require('commander')

var appRoot = require('./config').appRoot
var packageJson = require(appRoot + '/package.json')

module.exports = getProgram()

function getProgram () {
  program.on('*', function () {
    console.log(chalk.red('\nUnknown Command:', '"' + program.args.join(' ') + '"'))
    program.help()
  })

  // Return program bootstrapped with package.json version
  return program
    .version(packageJson.version)
}
