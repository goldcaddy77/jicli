#!/usr/bin/env node

'use strict'

var api = require('./lib/api')
var config = require('./lib/config')
var program = require('./lib/program')
var logger = require('./lib/logger').createLogger(config.getProjectDirectory())

program
  .usage('<command> [options]')

// Load commands from /command folder
require('./commands')(program)

// Process Commands
config.load()
  .then(api.load)
  .then((apiOptions) => {
    if (process.argv.length < 3) {
      program.outputHelp()
    }

    program.parse(process.argv)
  })
  .catch((err) => {
    console.error('Uncaught error running program', err)
    logger.error('Uncaught error running program', err, err.stack)
  })
