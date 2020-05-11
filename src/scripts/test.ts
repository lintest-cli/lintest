// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'development';

import chalk from 'chalk';
import { paths } from '../configures/paths';
import * as commandModule from '../methods/command';
import dotEnv from '../methods/dotEnv';
import * as fileModule from '../methods/file';

const args = process.argv.slice(2).map(arg => arg.trim().toLowerCase());
const testConfig: ITestConfig = {
  isWatch: (args[0] && args[0].toLowerCase() === 'watch') || false,
  isCoverage: (args[0] && args[0].toLowerCase() === 'coverage') || false,
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
const cmdResultTest = commandModule.run(
  'jest', // project/node_modules 경로에 설치됨
  [
    '--color', 'true',
    '--config', `${paths.ownPath}/dist/configures/jest.config.js`,
    '--rootDir', paths.appPath,
    '--passWithNoTests', // 테스트케이스가 하나도 없으면 종료시 0을 리턴하여 성공으로 표시
    //'--noStackTrace', // 테스트 실패시 stackTrack를 출력하지 않음
    '--coverageDirectory', `${paths.appPath}/coverage`,
    testConfig.isCoverage ? '--collectCoverage' : undefined,
    testConfig.isWatch ? '--watchAll' : undefined,
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
