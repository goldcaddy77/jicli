var logger = require('./logger')
var rp = require('request-promise')

var verbose = require('debug').enabled('jicli')

module.exports = request

  // Create request wrapper
function request (options) {
  if (verbose) {
    logger.logWithHeader('debug', 'REQUEST', JSON.stringify(options, null, 2))
  }

  return rp(options)
    .then((response) => {
      if (verbose) {
        logger.logWithHeader('debug', 'RESPONSE', JSON.stringify(response, null, 2))
      }

      return response
    })
}
