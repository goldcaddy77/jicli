'use strict'

var inquirer = require('inquirer')

module.exports = {
  askForProject: askForProject,
  askForIssueType: askForIssueType,
  askForSummary: askForSummary
}

function askForProject (options) {
  return askQuestion('Project', options)
}

function askForIssueType (options) {
  return askQuestion('Issue type', options)
}

function askForSummary () {
  return askQuestion('Please provide the issue name')
}

function askQuestion (prompt, choices) {
  var questions = [{
    type: 'input',
    name: 'question1',
    message: `${prompt}: `
  }]

  if (choices) {
    questions[0].type = 'list'
    questions[0].choices = choices
  }

  return inquirer.prompt(questions).then(function (answers) {
    return answers.question1
  })
}
