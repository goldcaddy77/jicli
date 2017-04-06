'use strict'

var q = require('q')

var api = require('../api')
var config = require('../config')
var userInput = require('../user-input')

module.exports = createIssue

// Get required meta data to create issues
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

      return config.updateDB({projects: result})
    })
}

function getProjectMap () {
  var projects = config.getState().projects

  return Object.keys(projects)
    .map((key) => {
      return {
        value: key,
        name: projects[key].name
      }
    })
}

function getIssueTypeMap (projectKey) {
  return config.getState().projects[projectKey]
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
    var lowerType = type.toLowerCase()

    // Else, look for the issue type supplied in the project's metadata
    var match = config.getState().projects[projectKey].issuetypes.find((item) => {
      return item.name.toLowerCase() === lowerType
    })

    if (!match) {
      throw new TypeError('Invalid issue type: ', type)
    }

    return match.id
  }
}

// API Docs: https://docs.atlassian.com/jira/REST/cloud/#api/2/issue-createIssue
function createIssue (program) {
  var issue = {}

  program = program || {}

  return reloadMetaData()
    .then(() => {
      // Only ask for project if it's not supplied
      var projectPromise = program.project
        ? q.when(program.project)
        : userInput.askQuestion('Project', 'list', getProjectMap())

      return projectPromise
    })
    .then((projectKey) => {
      issue.projectKey = projectKey

        // Only ask for issue type if it's not supplied
      return program.issueType
        ? q.when(resolveIssueType(projectKey, program.issueType))
        : userInput.askQuestion('Issue Type', 'list', getIssueTypeMap(projectKey))
    })
    .then((issueTypeId) => {
      issue.issueTypeId = issueTypeId

      return program.summary ? q.when(program.summary) : userInput.askQuestion('Issue Title')
    })
    .then((summary) => {
      issue.summary = summary

      if (program.skipDescription) {
        return null
      } else if (program.description) {
        return program.description
      } else {
        return userInput.askQuestion('Description', 'editor')
      }
    })
    .then((description) => {
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

      if (description) {
        newIssue.fields.description = description
      }

      // Add optional fields
      if (program.labels) {
        newIssue.fields.labels = program.labels.split(',')
      }

      if (program.assignee) {
        newIssue.fields.assignee = {
          // if user specifies `me`, assign to themselves
          name: program.assignee === 'me' ? config.getState().username : program.assignee
        }
      }

      return api
        .getClient()
        .addNewIssue(newIssue)
    })
}
