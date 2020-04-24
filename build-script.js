'use strict'

const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')
const spawn = require('cross-spawn')
const { minify } = require('uglify-es')

const buildPath = './dist';

function getDirectoryFiles (dir, callback) {
  const searchList = currDir => {
    fs.readdirSync(currDir).forEach(file => {
      const name = path.join(currDir, file)
      const relPath = name.replace(`${dir}/`, '')

      if (fs.statSync(name).isDirectory()) {
        if (callback(true, relPath, currDir, file) !== false) {
          // 해당 디렉토리 하위 탐색이 불필요할 시 콜백에서 false를 리턴
          searchList(name)
        }
      } else {
        callback(false, relPath, currDir, file)
      }
    })
  }
  searchList(dir)
}

// =====================
// clear build directory
// =====================
console.log('📌 Clean build directory...')
fs.emptyDirSync(buildPath)

// =====
// build
// =====
console.log('📌 Building project...')

const cmdResultBuild = spawn.sync(
  './node_modules/.bin/tsc',
  [
    '--listEmittedFiles', 'false',
    '--pretty',
    '--diagnostics', // 컴파일 결과 표시
    '--extendedDiagnostics', 'true', // 컴파일 결과 상세 표시
    '--preserveWatchOutput', 'true',
  ],
  { stdio: 'inherit' }
)
if (cmdResultBuild.status === 0) {
  console.log() // just add a new line if build success
} else {
  console.log(chalk.red('\nFailed to compile!\n'))
  process.exit(1)
}

// ======
// minify
// ======
console.log('📌 Minifying build files...')
getDirectoryFiles(buildPath, (isDir, relPath, currPath, currFile) => {
  if (!isDir && currFile.match(/\.js?$/)) {
    const file = String(fs.readFileSync(`${currPath}/${currFile}`))
    const result = minify(file, {
      compress: true,
      keep_fnames: false,
      ie8: false,
      toplevel: true,
    })

    if (result.error) {
      console.log(chalk.red(result.error.name))
      console.log(chalk.red(result.error.stack))
      process.exit(1)
    } else if (result.warnings) {
      console.log(chalk.yellow(result.warnings.join('\n')))
    } else {
      fs.writeFileSync(`${currPath}/${currFile}`, result.code)
    }
  }
})

console.log(chalk.green.bold('✔︎ Build succeed without errors.\n'))
