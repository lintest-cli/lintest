// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'development';

import chalk from 'chalk';
import { paths } from '../configures/paths';
import * as commandModule from '../methods/command';
import dotEnv from '../methods/dotEnv';
import * as fileModule from '../methods/file';

const args = process.argv.slice(2).map(arg => arg.trim().toLowerCase());
const testConfig: ITestConfig = {
  isCoverage: args.findIndex(arg => arg === 'coverage') !== -1,
  isNoCache: args.findIndex(arg => arg === 'nocache') !== -1,
  isWatch: args.findIndex(arg => arg === 'watch') !== -1,
};

// ====================================
// load .env variables into environment
// ====================================
if (fileModule.isFileExist(paths.appDotEnv)) {
  console.log('📌 Load .env variables into environment...');
  dotEnv(paths.appDotEnv);
}

// ======================
// run testcase with jest
// ======================
console.log('📌 Run testcase with Jest..\n'); // with add a new line!

const executor: string = (process.cwd() === __dirname)
  ? 'jest' // 프로젝트 내 디펜던시로 설치되어 있는 경우
  : `${__dirname}/../../node_modules/.bin/jest`; // 글로벌 영역에 설치되어 있는 경우 (현재 스크립트 기준 "dist/scripts"임)
const cmdResultTest = commandModule.run(
  executor,
  [
    '--color', 'true',
    '--config', `${paths.ownPath}/dist/configures/jest.config.js`,
    '--rootDir', paths.appPath,
    '--passWithNoTests', // 테스트케이스가 하나도 없으면 종료시 0을 리턴하여 성공으로 표시
    //'--noStackTrace', // 테스트 실패시 stackTrack를 출력하지 않음
    '--coverageDirectory', `${paths.appPath}/coverage`,
    testConfig.isCoverage ? '--collectCoverage' : undefined,
    testConfig.isWatch ? '--watchAll' : undefined,
    testConfig.isNoCache ? '--no-cache' : undefined,
  ].filter(Boolean)
);
if (cmdResultTest) {
  if (!testConfig.isWatch) {
    console.log(chalk.green.bold('\n✔︎ All tests passed (even if no test).\n'));
  }
} else {
  console.log(chalk.red.bold('\n✖︎ Failed to pass test with error.\n'));
  process.exit(1);
}
