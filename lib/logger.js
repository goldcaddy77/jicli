var chalk = require('chalk')
var logger // created later
var simpleLogger = require('simple-node-logger')
var verbose = require('debug').enabled('jicli')

var config = require('./config')

module.exports = {
  errorMessage: errorMessage,
  logger: createLogger(),
  logWithHeader: logWithHeader,
  successMessage: successMessage
}

function createLogger () {
  logger = simpleLogger.createSimpleFileLogger(`${config.getProjectDirectory()}/logger.log`)

  if (verbose) {
    logger.setLevel('debug')
  }

  return logger
}

function logWithHeader (logLevel, header, msg) {
  logger[logLevel](chalk.blue.bold(header, ':'), msg)
}

function successMessage () {
  logger.info(chalk.green('Success: ', arguments))
}

function errorMessage () {
  logger.debug(chalk.green('Error: ', arguments))
}
