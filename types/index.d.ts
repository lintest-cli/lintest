interface IPaths {
  isLocal: boolean;
  ownPath: string;
  ownPackageJson: string;
  ownNodeModules: string;
  appPath: string;
  appBuild: string;
  appPackageJson: string;
  appSrc: string;
  appNodeModules: string;
  appNodeModulesBin: string;
  appNodeModulesCache: string;
  appDotEnv: string;
  appTestSetupFiles: string[];
}

interface ISetupFilesPath {
  path: string;
  target: string;
}

interface ITestConfig {
  isWatch: boolean;
  isCoverage: boolean;
}

interface ILintestInfo {
  package: string;
  version: string;
  rootPath: string;
}

interface IOwnPackageJson {
  name: string;
  version: string;
}
