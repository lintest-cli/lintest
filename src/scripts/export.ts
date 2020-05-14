import path from 'path';
import chalk from 'chalk';
import { paths } from '../configures/paths';
import * as commandModule from '../methods/command';
import * as fileModule from '../methods/file';

const ownPackageJson: IOwnPackageJson = require(paths.ownPackageJson);
const pathCacheLintest = `${paths.appNodeModulesCache}/lintest`;
const pathLint = paths.isLocal ? 'eslint' : path.resolve(paths.ownNodeModules, 'eslint/bin/eslint.js'); // 심볼릭링크 지정금지
const pathTest = paths.isLocal ? 'jest' : path.resolve(paths.ownNodeModules, 'jest/bin/jest.js'); // 심볼릭링크 지정금지
const lintestInfo: ILintestInfo = {
  package: ownPackageJson.name,
  version: ownPackageJson.version,
  rootPath: path.resolve(paths.ownPath),
};
let isSucceed: boolean = true;

// ==========
// run export
// ==========
console.log('📌 Run export lint/test configurations...');

// 캐시 디렉토리가 없을 경우 생성
if (!fileModule.isFileExist(pathCacheLintest)) {
  fileModule.mkdirs(pathCacheLintest);
}

// lintest 정보 저장
fileModule.writePrettyJSON(`${pathCacheLintest}/info.json`, lintestInfo);

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
const cmdResultLint = commandModule.get(
  pathLint,
  [
    '--config', `${paths.ownPath}/dist/configures/eslint.config.js`,
    '--resolve-plugins-relative-to', paths.ownNodeModules, // set plugins in node_modules path
    '--print-config', `lint.config.json`, // 파일로 출력되지 않음
  ],
);
if (cmdResultLint) {
  fileModule.writePrettyJSON(`${pathCacheLintest}/lint.config.json`, JSON.parse(cmdResultLint));
} else {
  isSucceed = false;
}

// jest 환경설정 내용 출력
const cmdResultTest = commandModule.get(
  pathTest,
  [
    '--config', `${paths.ownPath}/dist/configures/jest.config.js`,
    '--rootDir', paths.appPath,
    '--passWithNoTests', // 테스트케이스가 하나도 없으면 종료시 0을 리턴하여 성공으로 표시
    '--showConfig',
  ],
);
if (cmdResultTest) {
  fileModule.writePrettyJSON(`${pathCacheLintest}/test.config.json`, JSON.parse(cmdResultTest));
} else {
  isSucceed = false;
}

// 완료
if (isSucceed) {
  console.log(chalk.green.bold('✔︎ Exported cache data was succeed.\n'));
} else {
  console.log(chalk.red.bold('✖︎ Failed to export cache data.\n'));
  process.exit(1);
}
