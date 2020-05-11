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

const executor: string = (process.cwd() === __dirname)
  ? 'eslint' // 프로젝트 내 디펜던시로 설치되어 있는 경우
  : `${__dirname}/../../node_modules/.bin/eslint`; // 글로벌 영역에 설치되어 있는 경우 (현재 스크립트 기준 "dist/scripts"임)
const srcPath: string = fileModule.isFileExist(paths.appSrc) ? './src' : '.';
const cmdResultLint = commandModule.run(
  executor,
  [
    '--color',
    //'--no-eslintrc',
    '--config', `${paths.ownPath}/dist/configures/eslint.config.js`,
    '--resolve-plugins-relative-to', paths.ownNodeModules, // set plugins in node_modules path
    '--max-warnings', '100',
    isFix ? '--fix' : undefined,
    isDebug ? '--debug' : undefined,
    '--ext', '.ts,.tsx,.js,.jsx,.vue,.mjs',
    srcPath,
  ].filter(Boolean),
);
if (cmdResultLint) {
  console.log(chalk.green.bold('✔︎ Finished without rule violations.\n'));
} else {
  console.log(chalk.red.bold('✖︎ Failed with one or more rule violations.\n'));
}
