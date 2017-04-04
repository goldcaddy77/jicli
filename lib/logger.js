var chalk = require('chalk')
var simpleLogger = require('simple-node-logger')
var verbose = require('debug').enabled('jicli')

var logger // created later

module.exports = {
  errorMessage: errorMessage,
  createLogger: createLogger,
  handleError: handleError,
  logger: logger,
  logWithHeader: logWithHeader,
  successMessage: successMessage
}

function createLogger (baseDirectory) {
  logger = simpleLogger.createSimpleFileLogger(`${baseDirectory}/logger.log`)

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

function handleError (err, exitCode) {
  if (err.message) {
    logger.errorMessage(err.message)
  } else {
    logger.errorMessage(err)
  }

  process.exit(exitCode || 1)
}
