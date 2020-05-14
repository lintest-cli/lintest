import path from 'path';
import { isFileExist } from '../methods/file';

const appDirectory = process.cwd();
const resolveOwn = (relativePath: string) => path.resolve(__dirname, '..', '..', relativePath); // script-runner의 루트 경로
const resolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath); // 생성되는 앱의 루트 경로
const ownPath = resolveOwn('.');
const appPath = resolveApp('.');

// 테스트셋업 파일 경로 찾기
const setupFilesPath: ISetupFilesPath[] = [
  { path: `${appPath}/src/test/@setup.ts`, target: '<rootDir>/src/test/@setup.ts' },
  { path: `${appPath}/src/test/@setup.js`, target: '<rootDir>/src/test/@setup.js' },
  { path: `${appPath}/test/@setup.ts`, target: '<rootDir>/test/@setup.ts' },
  { path: `${appPath}/test/@setup.js`, target: '<rootDir>/test/@setup.js' },
  { path: `${appPath}/test-setup.ts`, target: '<rootDir>/test-setup.ts' },
  { path: `${appPath}/test-setup.js`, target: '<rootDir>/test-setup.js' },
];
// Checks existing test-setup files (@setup.t|js, test-setup.t|js) in each paths
const appTestSetupFiles: string[] = [];
for (const setupFile of setupFilesPath) {
  if (isFileExist(setupFile.path)) {
    appTestSetupFiles.push(setupFile.target);
    //break;
  }
}

// 생성된 앱에서의 경로
export const paths: IPaths = {
  isLocal: ownPath === appPath,
  ownPath: path.resolve(ownPath),
  ownPackageJson: resolveOwn('package.json'),
  ownNodeModules: resolveOwn('node_modules'),
  appPath: path.resolve(appPath),
  appBuild: resolveApp('dist'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appNodeModules: resolveApp('node_modules'),
  appNodeModulesBin: resolveApp('node_modules/.bin'),
  appNodeModulesCache: resolveApp('node_modules/.cache'),
  appDotEnv: resolveApp('.env'),
  appTestSetupFiles,
};
