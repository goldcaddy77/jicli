'use strict'

var findConfig = require('find-config')

var fileAsync = require('lowdb/lib/storages/file-async')
var fs = require('fs')
var low = require('lowdb')
var path = require('path')
var q = require('q')

var auth = require('./auth')
var configUpdater = require('./config/').init
var JICLI_DIRECTORY = '.jicli'
var logger = require('./logger')

// Globals (set below and cached)
var projectConfigDirectory
var db

module.exports = {
  load: load,
  getDB: getDB,
  getState: getState,
  getProjectConfigDirectory: getProjectConfigDirectory,
  updateDB: updateDB,
  updateConfig: updateConfig
}

function load () {
  var db = getDB()

  // If protocol missing from config file, make user set things up again
  if (db.has('protocol').value()) {
    return q.when(db.getState())
  } else {
    return updateConfig()
  }
}

function updateConfig () {
  var db = getDB()
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
    .then((config) => {
      logger.successMessage('config file written to', configFileName())
      return config
    })
}

function getProjectConfigDirectory () {
  var foundFile, foundPackageJson

  if (projectConfigDirectory) {
    return projectConfigDirectory // return cached value
  }

  foundFile = findConfig.obj('config.json', { dir: '.jicli' })

  if (foundFile) {
    projectConfigDirectory = path.join(foundFile.dir, '/')
    return projectConfigDirectory // or recurse up the chain to find first config folder
  }

  foundPackageJson = findConfig.obj('package.json')

  // or look up the chain for first package.json folder
  if (foundPackageJson) {
    projectConfigDirectory = path.join(foundPackageJson.dir, JICLI_DIRECTORY, '/')
  } else {
    projectConfigDirectory = path.join(process.cwd(), JICLI_DIRECTORY, '/') // fall back to current working directory
  }

  if (!fs.existsSync(projectConfigDirectory)) {
    console.log('Config directory not found, creating:', projectConfigDirectory)
    fs.mkdirSync(projectConfigDirectory)
  }

  return projectConfigDirectory
}

function configFileName () {
  return `${getProjectConfigDirectory()}config.json`
}

function getState () {
  return getDB().getState()
}

function getDB () {
  if (db) {
    return db
  }

  db = low(configFileName(), {
    storage: fileAsync,
    format: {
      serialize: (obj) => {
        return JSON.stringify(obj, null, 2)
      }
    }
  })

  return db
}

function updateDB (options) {
  return getDB()
    .assign(options)
    .write()
}
