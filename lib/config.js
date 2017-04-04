'use strict'

var appRoot = require('app-root-path').path
var fileAsync = require('lowdb/lib/storages/file-async')
var fs = require('fs')
var low = require('lowdb')
var inquirer = require('inquirer')
var path = require('path')
var q = require('q')

var auth = require('./auth')
var DIRECTORY = '.jicli'

module.exports = {
  appRoot: appRoot,
  load: load,
  getDB: getDB,
  getState: getState,
  getProjectDirectory: getProjectDirectory,
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

function getProjectDirectory () {
  var directory = path.join(appRoot, DIRECTORY, '/')

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory)
  }

  return directory
}

function getState () {
  return getDB().getState()
}

function getDB () {
  return low(`${getProjectDirectory()}/config.json`, { storage: fileAsync })
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
