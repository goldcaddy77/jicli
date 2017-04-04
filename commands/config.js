'use strict'

var config = require('../lib/config')
var logger = require('../lib/logger')

module.exports = function create (program) {
  program
    .command('config')
    .description('Re-initialize your config')
    .action(() => {
      return config.updateConfig()
        .then((cfg) => {
          logger.successMessage('Config updated')
        })
        .catch(logger.handleError)
    })
}
