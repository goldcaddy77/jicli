'use strict'

var inquirer = require('inquirer')

module.exports = {
  askQuestion: askQuestion
}

function askQuestion (prompt, type, choices) {
  type = type || 'input'

  var questions = [{
    type: type,
    name: 'question1',
    message: `${prompt}: `
  }]

  if (type === 'list') {
    questions[0].choices = choices
  }

  return inquirer.prompt(questions).then(function (answers) {
    return answers.question1
  })
}
