#!/usr/bin/env node

'use strict'

var program = require('commander')
var colors = require('colors')

var packageJson = require('./package.json')

var api = require('./src/api')
var config = require('./src/config')
var issues = require('./src/issues/')

config.load()
  .then(api.load)
  .then((apiOptions) => {
    program
      .version(packageJson.version)

    program
      .command('create [options]')
      .description('Create a new issue')
      .option('-t, --issue-type [type]', 'Issue type (numeric or enum{task, story, sub-task, epic, bug})')
      .option('-p, --project [key]', 'Project key')
      .option('-s, --summary [string]', 'Summary (title)')
      .option('-d, --description [string]', 'Description')
      .option('-a, --assignee [username]', 'Assignee (use `me` to assign to yourself)')
      .option('-l, --labels [l1,l2,l3]', 'Labels (comma-delimited)')
      .action((_, options) => {
        return issues.create(options)
          .then((issue) => {
            console.log(`\nIssue created: ${colors.bold.green(issue.key)}\n`)
            console.log(`${config.state().protocol}://${config.state().host}/browse/${issue.key}\n`)
          })
          .catch((err) => {
            var errors = err.error.errors

            console.error(colors.bold.red('\nError trying to create issue:\n'))

            Object.keys(errors).forEach((key) => {
              console.error(` - ${colors.red(key)}: ${errors[key]}`)
            })
          })
      })

    // display help if bad command is passed in
    program
      .command('*')
      .action((c, o) => {
        console.log('Command"', c, '"not found. Options: ', o)
        program.outputHelp()
      })

    // show help if no arguments
    if (process.argv.length < 3) {
      program.outputHelp()
    }

    program.parse(process.argv)
  })
  .catch(console.error)
