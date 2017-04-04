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

function successMessage (msg) {
  var formatted = chalk.green('\nSuccess: ', msg, '\n')
  logger.info(formatted)
  console.log(formatted)
}

function errorMessage (msg) {
  var formatted = chalk.red('\nError: ', msg, '\n')
  logger.debug(formatted)
  console.error(formatted)
}

function handleError (err, exitCode) {
  if (err.statusCode === 401) {
    errorMessage('Unauthorized')
  } else if (err.message) {
    errorMessage(err.message)
  } else {
    errorMessage(err)
  }

  process.exit(exitCode || 1)
}
