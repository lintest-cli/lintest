import chalk from 'chalk';
import { paths } from '../configures/paths';
import * as commandModule from '../methods/command';
import * as fileModule from '../methods/file';

// ==========
// run eslint
// ==========
const args = process.argv.slice(2);
const isFix = args.findIndex(arg => arg === 'fix') !== -1;
const isDebug = args.findIndex(arg => arg === 'debug') !== -1;

if (isFix) {
  console.log('📌 Run ESLint with TypeScript, auto-fix mode...');
} else {
  console.log('📌 Run ESLint with TypeScript...');
}

const srcPath = fileModule.isFileExist(paths.appSrc) ? paths.appSrc : '.';
const cmdResultLint = commandModule.run(
  `${paths.ownNodeModules}/.bin/eslint`,
  [
    '--color',
    //'--no-eslintrc',
    '--config', `${paths.ownPath}/dist/configures/eslint.config.js`,
    '--resolve-plugins-relative-to', paths.ownNodeModules, // set plugins in node_modules path
    '--max-warnings', '100',
    isFix ? '--fix' : undefined,
    isDebug ? '--debug' : undefined,
    '--ext', '.ts,.tsx,.js,.jsx,.mjs',
    srcPath,
  ].filter(Boolean),
);
if (cmdResultLint) {
  console.log(chalk.green.bold('✔︎ Finished without rule violations.\n'));
} else {
  console.log(chalk.red.bold('✖︎ Failed with one or more rule violations.\n'));
}
