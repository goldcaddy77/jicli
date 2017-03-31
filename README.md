# jicli

[![npm version](https://img.shields.io/npm/v/jicli.svg)](https://www.npmjs.org/package/jicli)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-dbb30b.svg)](https://standardjs.com)

## A Flexible Jira CLI

JIRA CLI focused on simple ticket creation, written in Node.

## Table of Contents

- [Install](#install)
- [Setup](#setup)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)

## Install

```bash
> npm install -g jicli
```

## Setup

On first usage, run `jira` and you will be asked for your Jira credentials:

```bash
> jira

 Jira host:  example.atlassian.com
 Jira username : user1
 Jira password: ***********
 HTTP protocol (http or https) https
```

Config settings will be saved in `<project-root>/.jicli`.

## Usage

Run `jicli` or `jicli --help` to get usage:

Note: executable also aliased as `jira`

```
  Usage: jicli [options] [command]


  Commands:

    create [options]  Create a new issue

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

### Create

```
  Usage: create [options]

  Create a new issue

  Options:

    -h, --help                  output usage information
    -p, --project [key]         Project key
    -t, --issue-type [type]     Issue type (numeric or enum{task, story, sub-task, epic, bug})
    -s, --summary [string]      Summary (title)
    -d, --description [string]  Description
    -l, --labels [l1,l2,l3]     Labels (comma-delimited)
    -a, --assignee [username]   Assignee (use `me` to assign to yourself)
```

## Examples

### Creating issues

Create issue interactively with prompts:
```
jicli create

? Project:  Mobile
? Issue Type: Task
? Issue Title:  My new issue
```

Supply some of the required fields and jicli will ask for the missing items:
```
jicli create -p MOB -t Task

? Issue Title:  My new issue
```

Notice that project and issue type prompts are skipped

Holy grail with all required and optional fields ()
```
jicli create -p MOB -t task -s "My issue title" -d "My issue description" -l 'label1,label2' -a me
```

## Authentication

When you first set up jicli, it will prompt for your username / password.  From this, it will create a token and add 
it to the config file `<root>/.jicli`

## Contribute

PRs accepted.  Note that code uses [standard](https://github.com/feross/standard) styling.

## License

MIT © Dan Caddigan
