var inquirer = require('inquirer')

module.exports = initializeConfig

function initializeConfig (currentState) {
  var questions = [
    {
      type: ' input',
      name: 'host',
      default: currentState.host || '',
      message: 'Jira host: ',
      validate: function (value) { return value && /\./.test(value) }
    },
    {
      type: 'input',
      name: 'username',
      default: currentState.username || '',
      message: 'Jira username :',
      validate: function (value) { return value && value.length > 0 }
    },
    {
      type: 'password',
      name: 'password',
      default: currentState.password || '',
      message: 'Jira password:',
      validate: function (value) { return value && value.length > 0 }
    },
    {
      type: 'input',
      name: 'protocol',
      default: 'https',
      message: 'HTTP protocol (http or https)',
      validate: function (value) { return /^https?$/.test(value) }
    }
  ].map((item) => {
    if (!item.default) {
      delete item.default
    }
    return item
  })

  return inquirer
    .prompt(questions)
}
