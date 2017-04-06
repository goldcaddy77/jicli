var chalk = require('chalk')
var simpleLogger = require('simple-node-logger')
var verbose = require('debug').enabled('jicli')

var logger // created later

module.exports = {
  errorMessage: errorMessage,
  createLogger: createLogger,
  infoMessage: infoMessage,
  handleError: handleError,
  logger: logger,
  logWithHeader: logWithHeader,
  successMessage: successMessage
}

function createLogger (baseDirectory) {
  logger = simpleLogger.createSimpleFileLogger(`${baseDirectory}logger.log`)

  if (verbose) {
    logger.setLevel('debug')
  }

  return logger
}

function logWithHeader (logLevel, header, label) {
  logger[logLevel](chalk.blue.bold(header, ':'), label)
}

function logMessage (strings, options) {
  var formatted

  if (options.label) {
    strings = [`${options.label}:`].concat(strings)
  }

  formatted = `\n${chalk[options.color].apply(null, strings)}\n`

  logger[options.logLevel](formatted)
  console[options.consoleLevel](formatted)
}

function infoMessage () {
  logMessage(Array.from(arguments), {
    color: 'blue',
    consoleLevel: 'log',
    logLevel: 'info'
  })
}

function successMessage () {
  logMessage(Array.from(arguments), {
    color: 'green',
    consoleLevel: 'log',
    logLevel: 'info',
    label: 'Success'
  })
}

function errorMessage () {
  logMessage(Array.from(arguments), {
    color: 'red',
    consoleLevel: 'error',
    logLevel: 'debug',
    label: 'Error'
  })
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
