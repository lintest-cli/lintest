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
  appDotEnv: string;
}

interface ITestConfig {
  isWatch: boolean;
  isCoverage: boolean;
}
