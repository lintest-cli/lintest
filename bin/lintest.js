#!/usr/bin/env node
'use strict'

const chalk = require('chalk')
const { paths } = require('../dist/configures/paths')
const commandModule = require('../dist/methods/command')

// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'production'
// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

const commandArgs = [
  'lint',
  'test',
]
const args = process.argv.slice(2)
const scriptIndex = args.findIndex(x => commandArgs.indexOf(x) !== -1)
const script = scriptIndex === -1 ? args[0] : args[scriptIndex]
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : []

if (commandArgs.indexOf(script) !== -1) {
  commandModule.displayTitle()

  const cmdResultNode = commandModule.run(
    'node',
    [
      `${paths.appNodeModules}/${commandModule.rootPackageJson.name}/dist/scripts/${script}`,
      nodeArgs.concat(args.slice(scriptIndex + 1)),
    ],
  )

  if (!cmdResultNode) {
    process.exit(1)
  }
} else {
  console.log(chalk.red(`Unknown command "${script}`))
}
