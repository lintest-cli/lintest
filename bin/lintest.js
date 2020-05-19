#!/usr/bin/env node
'use strict'

const chalk = require('chalk')
const { paths } = require('../dist/configures/paths')
const commandModule = require('../dist/methods/command')
const fileModule = require('../dist/methods/file')

// IS_LOCAL_ENV 환경설정값이 false로 존재한다면 실행 무시 (빌드/배포환경에 따라 해당 값을 설정해준다)
if (process.env.IS_LOCAL_ENV === 'false') {
  chalk.red.bold(`\nExecution bypassed by environment variable.\n`)
  process.exit(0)
}

// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'production'
// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

const commandArgs = [
  'export',
  'lint',
  'test',
]
const args = process.argv.slice(2)
const scriptIndex = args.findIndex(x => commandArgs.indexOf(x) !== -1)
const script = scriptIndex === -1 ? args[0] : args[scriptIndex]
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : []

commandModule.displayTitle()

if (commandArgs.indexOf(script) !== -1) {
  const cmdResultNode = commandModule.run(
    'node',
    [`${__dirname}/../dist/scripts/${script}`, nodeArgs.concat(args.slice(scriptIndex + 1))],
  )

  if (!cmdResultNode) {
    process.exit(1)
  }
} else {
  if (script) {
    console.log(chalk.red.bold(`\nUnknown command "${script}"\n`))
  } else {
    console.log(chalk.red.bold('\nNo command entered.\n'))
  }
  console.log('Available command is', commandArgs.map(v => chalk.cyan(v)).join(', '), '\n')
}
