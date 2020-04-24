import path from 'path';

const appDirectory = process.cwd();
const resolveOwn = (relativePath: string) => path.resolve(__dirname, '..', '..', relativePath); // script-runner의 루트 경로
const resolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath); // 생성되는 앱의 루트 경로
const ownPath = resolveOwn('.');
const appPath = resolveApp('.');

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
  appDotEnv: resolveApp('.env'),
};
