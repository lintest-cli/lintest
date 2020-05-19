import path from 'path';
import chalk from 'chalk';
import { paths } from '../configures/paths';
import * as commandModule from '../methods/command';
import * as fileModule from '../methods/file';

const args = process.argv.slice(2);
const isDebug = args.findIndex(arg => arg === 'debug') !== -1;
const pathLint = paths.isLocal ? 'eslint' : path.resolve(paths.ownNodeModules, 'eslint/bin/eslint.js'); // 심볼릭링크 지정금지
const pathTest = paths.isLocal ? 'jest' : path.resolve(paths.ownNodeModules, 'jest/bin/jest.js'); // 심볼릭링크 지정금지
const cmdParamLint = [
  '--config', `${paths.ownPath}/dist/configures/eslint.config.js`,
  '--resolve-plugins-relative-to', paths.ownNodeModules, // set plugins in node_modules path
  '--print-config', '.eslint-config-temporary', // 사실상 파일로 출력되지 않음
];
const cmdParamTest = [
  '--config', `${paths.ownPath}/dist/configures/jest.config.js`,
  '--rootDir', paths.appPath,
  '--passWithNoTests', // 테스트케이스가 하나도 없으면 종료시 0을 리턴하여 성공으로 표시
  '--showConfig',
];
let isSucceed: boolean = true;

// ==========
// run export
// ==========
console.log('📌 Run export lint/test configurations...');

// 글로벌 설치인 경우에만 필요
if (!paths.isLocal) {
  // bin 디렉토리가 없을 경우 생성
  if (!fileModule.isFileExist(paths.appNodeModulesBin)) {
    fileModule.mkdirs(paths.appNodeModulesBin);
  }
  // 실행파일에 대한 심볼릭 링크 생성
  fileModule.copy(pathLint, `${paths.appNodeModulesBin}/eslint`, true);
  fileModule.copy(pathTest, `${paths.appNodeModulesBin}/jest`, true);
}

// eslint 환경설정 내용 출력
if (isDebug) {
  console.log();
  console.log(chalk.bgGray.white.bold('[debug]'), chalk.magentaBright.bold('Exporting ESLint configuration...'));
  isSucceed = commandModule.run(pathLint, cmdParamLint);
} else {
  const cmdResultLint = commandModule.get(pathLint, cmdParamLint);
  if (cmdResultLint) {
    fileModule.writePrettyJSON(`${paths.appPath}/eslint.config.json`, JSON.parse(cmdResultLint));
  } else {
    isSucceed = false;
  }
}

// jest 환경설정 내용 출력
if (isDebug) {
  console.log();
  console.log(chalk.bgGray.white.bold('[debug]'), chalk.magentaBright.bold('Exporting Jest configuration...'));
  isSucceed = commandModule.run(pathTest, cmdParamTest);
} else {
  const cmdResultTest = commandModule.get(pathTest, cmdParamTest);
  if (cmdResultTest) {
    fileModule.writePrettyJSON(`${paths.appPath}/jest.config.json`, JSON.parse(cmdResultTest));
  } else {
    isSucceed = false;
  }
}

// 완료
if (isSucceed) {
  if (isDebug) {
    console.log(chalk.green.bold('✔︎ Configuration files are exportable.\n'));
  } else {
    console.log(chalk.green.bold('✔︎ Exported configuration files.\n'));
  }
} else {
  if (isDebug) {
    console.log(chalk.red.bold('✖︎ Check your environment for exporting configuration files as normal.\n'));
  } else {
    console.log(chalk.red.bold('✖︎ Failed to export configuration files.\n'));
  }
  process.exit(1);
}
