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
}

interface ILintConfig {
  isFix: boolean;
  isDebug: boolean;
  isNoCache: boolean;
}

interface ITestConfig {
  isCoverage: boolean;
  isNoCache: boolean;
  isWatch: boolean;
}
