'use strict'

var request = require('./utils').request

module.exports = {
  getToken: getToken,
  requestClientWithToken: requestClientWithToken
}

// Takes in a token and returns a request client that will pass the Auth token with each call
function requestClientWithToken (token) {
  return function requestWithToken (options) {
    options.headers = options.headers || {}
    options.headers['Authorization'] = `Basic ${token}`

    return request(options)
  }
}

function getToken (username, password) {
  return new Buffer(username + ':' + password).toString('base64')
}
