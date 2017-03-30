'use strict'

var request = require('request-promise')

module.exports = {
  getToken: getToken,
  requestWithToken: requestWithToken
}

function requestWithToken (options) {
  var token = this
  var newOptions = options

  newOptions.headers = newOptions.headers || {}
  newOptions.headers['Authorization'] = `Basic ${token}`

  return request(newOptions)
}

function getToken (username, password) {
  return new Buffer(username + ':' + password).toString('base64')
}
