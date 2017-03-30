'use strict'

var JiraApi = require('jira-client')
var q = require('q')

var auth = require('./auth')
var config = require('./config')
var jiraClient // instance of the jira-client

module.exports = {
  apiRequest: apiRequest,
  load: load,
  client: client
}

function load () {
  var state = config.state()
  var options = {
    protocol: state.protocol,
    host: state.host,
    apiVersion: 2,
    strictSSL: true,
    request: auth.requestWithToken.bind(state.token)
  }

  jiraClient = new JiraApi(options)

  return q.when(jiraClient)
}

function client () {
  return jiraClient
}

// For making API requests that 'jira-client' doesn't cover
function apiRequest (path, options) {
  options = options || {}
  var uri = jiraClient.makeUri({ pathname: path })
  var request = jiraClient.makeRequestHeader(uri, options)

  return jiraClient.doRequest(request)
}
