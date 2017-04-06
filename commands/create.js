'use strict'

var chalk = require('chalk')

var createIssue = require('../lib/issues/create')
var config = require('../lib/config')
var logger = require('../lib/logger')

module.exports = function create (program) {
  program
    .command('create')
    .description('Create a new issue')
    .option('-p, --project [key]', 'Project key')
    .option('-t, --issue-type [type]', 'Issue type (numeric or enum{task, story, sub-task, epic, bug})')
    .option('-s, --summary [string]', 'Summary (title)')
    .option('-d, --description [string]', 'Description (opens in editor)')
    .option('-x, --skip-description', 'Skip entering the description field')
    .option('-l, --labels [l1,l2,l3]', 'Labels (comma-delimited)')
    .option('-a, --assignee [username]', 'Assignee (use `me` to assign to yourself)')
    .action((program) => {
      // passing program in blindly causes a conflict because we have a `description` option and there is a
      // description method on `program`
      var options = {}
      for (let key in program) {
        if (program.hasOwnProperty(key)) {
          options[key] = program[key]
        }
      }

      return createIssue(options)
        .then((issue) => {
          var state = config.getState()

          console.log(`\nIssue created: ${chalk.bold.green(issue.key)}\n`)
          console.log(`${state.protocol}://${state.host}/browse/${issue.key}\n`)

          process.exit()
        })
        .catch(logger.handleError)
    })
}
