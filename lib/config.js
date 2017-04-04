'use strict'

var appRoot = require('app-root-path').path
var fileAsync = require('lowdb/lib/storages/file-async')
var fs = require('fs')
var low = require('lowdb')
var path = require('path')
var q = require('q')

var auth = require('./auth')
var configUpdater = require('./config/').init
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
    var state = db.getState()

    return configUpdater(state)
      .then(function (answers) {
        return db.assign({
          protocol: answers.protocol,
          host: answers.host,
          username: answers.username,
          token: auth.getToken(answers.username, answers.password),
          apiVersion: '2'
        })
        .write()
      })
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
