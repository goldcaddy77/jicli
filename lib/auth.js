'use strict'

var request = require('./request')

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
  return Buffer.from(username + ':' + password).toString('base64')
}
