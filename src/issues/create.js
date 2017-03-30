'use strict'

var q = require('q')

var api = require('../api')
var config = require('../config')
var userInput = require('../user-input')

module.exports = {
  getMetaData: getMetaData,
  create: create
}

  /**
  * Get required meta data to create issues
  */
function getMetaData () {
  return api.apiRequest('/issue/createmeta')
}

function reloadMetaData () {
  return getMetaData()
    .then((meta) => {
      var result = {}

      // Populate projects, keys and their respective issue types
      for (var index in meta.projects) {
        let p = meta.projects[index]

        result[p.key] = {
          id: p.id,
          name: p.name,
          issuetypes: p.issuetypes
        }
      }

      return config.update({projects: result})
    })
}

function getProjectMap () {
  var projects = config.state().projects

  return Object.keys(projects)
    .map((key) => {
      return {
        value: key,
        name: projects[key].name
      }
    })
}

function getIssueTypeMap (projectKey) {
  return config.state().projects[projectKey]
    .issuetypes
    .map(function (type) {
      return {
        value: type.id,
        name: type.name
      }
    })
}

function resolveIssueType (projectKey, type) {
  // If we were passed an ID, return it
  if (!isNaN(type)) {
    return type
  } else {
    // Else, look for the issue type supplied in the project's metadata
    var match = config.state().projects[projectKey].issuetypes.find((item) => {
      return item.name.toLowerCase() === type
    })

    return match.id
  }
}

// API Docs: https://docs.atlassian.com/jira/REST/cloud/#api/2/issue-createIssue
function create (options) {
  var issue = {}

  options = options || {}

    // Only ask for project if it's not supplied
  var projectPromise = options.project
    ? q.when(options.project)
    : userInput.askForProject(getProjectMap())

  return reloadMetaData()
    .then(() => {
      return projectPromise
    })
    .then((projectKey) => {
      issue.projectKey = projectKey

        // Only ask for issue type if it's not supplied
      return options.issueType
        ? q.when(resolveIssueType(projectKey, options.issueType))
        : userInput.askForIssueType(getIssueTypeMap(projectKey))
    })
    .then((issueTypeId) => {
      issue.issueTypeId = issueTypeId

      return options.summary ? q.when(options.summary) : userInput.askForSummary()
    })
    .then((summary) => {
      issue.summary = summary

      // Create issue object with required fields
      var newIssue = {
        fields: {
          project: {
            key: issue.projectKey
          },
          summary: issue.summary,
          issuetype: {
            id: issue.issueTypeId
          }
        }
      }

      // Add optional fields
      if (options.labels) {
        newIssue.fields.labels = options.labels.split(',')
      }

      if (options.description) {
        newIssue.fields.description = options.description
      }

      if (options.assignee) {
        newIssue.fields.assignee = {
          // if user specifies `me`, assign to themselves
          name: options.assignee === 'me' ? config.state().username : options.assignee
        }
      }

      return api.client().addNewIssue(newIssue)
    })
}
