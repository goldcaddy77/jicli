'use strict'

var fileAsync = require('lowdb/lib/storages/file-async')
var low = require('lowdb')
var inquirer = require('inquirer')
var q = require('q')

var auth = require('./auth')
var JICLI_CONFIG_FILE = '.jicli'

module.exports = {
  load: load,
  getDB: getDB,
  state: state,
  update: update
}

function load () {
  var db = getDB()

  // If protocol missing from config file, make user set things up again
  if (db.has('protocol').value()) {
    return q.when(db.getState())
  } else {
    return initializeConfig()
  }
}

function state () {
  return getDB().getState()
}

function getDB () {
  return low(JICLI_CONFIG_FILE, { storage: fileAsync })
}

function update (options) {
  return getDB()
    .assign(options)
    .write()
}

function initializeConfig () {
  var db = getDB()
  var state = db.getState()
  var questions = [
    {
      type: ' input',
      name: 'host',
      default: state.host || '',
      message: 'Jira host: ',
      validate: function (value) { return value && /\./.test(value) }
    },
    {
      type: 'input',
      name: 'username',
      default: state.username || '',
      message: 'Jira username :',
      validate: function (value) { return value && value.length > 0 }
    },
    {
      type: 'password',
      name: 'password',
      default: state.password || '',
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
  ]

  return inquirer
    .prompt(questions)
    .then(function (answers) {
      return db.assign({
        protocol: answers.protocol,
        host: answers.host,
        username: answers.username,
        password: answers.password,
        token: auth.getToken(answers.username, answers.password),
        apiVersion: '2'
      })
      .write()
    })
}
