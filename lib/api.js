'use strict'

var JiraApi = require('jira-client')
var q = require('q')

var auth = require('./auth')
var config = require('./config')
var jiraClient // instance of the jira-client

module.exports = {
  apiRequest: apiRequest,
  load: load,
  getClient: getClient
}

function load () {
  var state = config.getState()
  var options = {
    protocol: state.protocol,
    host: state.host,
    apiVersion: 2,
    strictSSL: true,

    // Not passing username or password as our custom request class has our token baked in
    request: auth.requestClientWithToken(state.token)
  }

  jiraClient = new JiraApi(options)

  return q.when(jiraClient)
}

function getClient () {
  return jiraClient
}

// For making API requests that 'jira-client' doesn't cover
function apiRequest (path, options) {
  options = options || {}
  var uri = jiraClient.makeUri({ pathname: path })
  var request = jiraClient.makeRequestHeader(uri, options)

  return jiraClient.doRequest(request)
}
