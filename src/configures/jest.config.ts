import chalk from 'chalk';
import deepmerge from 'deepmerge';
import { paths } from './paths';
import { isFileExist } from '../methods/file';

interface ISetupFilesPath {
  path: string;
  target: string;
}

const transform = {
  tsjest: `${paths.ownNodeModules}/ts-jest`,
  stub: `${paths.ownNodeModules}/jest-transform-stub`,
  vuejest: `${paths.ownNodeModules}/vue-jest`,
};
const setupFilesPath: ISetupFilesPath[] = [
  { path: `${paths.appPath}/src/test/@setup.ts`, target: '<rootDir>/src/test/@setup.ts' },
  { path: `${paths.appPath}/src/test/@setup.js`, target: '<rootDir>/src/test/@setup.js' },
  { path: `${paths.appPath}/test/@setup.ts`, target: '<rootDir>/test/@setup.ts' },
  { path: `${paths.appPath}/test/@setup.js`, target: '<rootDir>/test/@setup.js' },
  { path: `${paths.appPath}/test-setup.ts`, target: '<rootDir>/test-setup.ts' },
  { path: `${paths.appPath}/test-setup.js`, target: '<rootDir>/test-setup.js' },
];
const setupFiles: string[] = [];
const roots: string[] = [];

// Checks existing test-setup files (@setup.t|js, test-setup.t|js) in each paths
for (const setupFile of setupFilesPath) {
  if (isFileExist(setupFile.path)) {
    setupFiles.push(setupFile.target);
    console.log(`Setup file: ${setupFile.path}`);
    //break;
  }
}
if (setupFiles.length) {
  console.log();
} else {
  console.log(chalk.whiteBright.bold('No setup files found in project path.'));
}

// Checks test roots path
if (isFileExist(paths.appSrc)) {
  roots.push('<rootDir>/src');
}
if (isFileExist(`${paths.appSrc}/test`)) {
  roots.push('<rootDir>/src/test');
}
if (isFileExist(`${paths.appPath}/test`)) {
  roots.push('<rootDir>/test');
}
if (!roots.length) {
  roots.push('<rootDir>');
}

// use "module.exports" (do not "export default")
const defaultConfig = {
  roots,
  setupFiles,
  testEnvironment: 'jsdom',
  testURL: 'http://localhost',
  transform: {
    '.vue$': transform.vuejest,
    '\\.([t|j]sx?|mjs)$': transform.tsjest,
    '\\.(bmp|gif|jpe?g|png|tiff?|ico|webp|svg|mp4|webm|flac|mp3|wav|ogg|aac|eot|[t|o]tf|woff2?)$': transform.stub,
    '\\.((sa|sc|c|le)ss|styl(us)?)$': transform.stub,
  },
  transformIgnorePatterns: [
    '/coverage',
    '/bin',
    '/dist',
    '/build',
    '/out',
    '/public',
    '/node_modules/',
    '/.idea',
    '/.vscode',
    '/.git',
  ],
  testRegex: '\\.(test|spec)\\.([t|j]sx?|mjs)$',
  moduleFileExtensions: [
    'ts', 'tsx', 'js', 'jsx', 'mjs', 'json', 'vue',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/src/$1',
    '^@@/(.*)$': '<rootDir>/src/$1',
    '^~~/(.*)$': '<rootDir>/src/$1',
    '\\.(bmp|gif|jpe?g|png|tiff?|ico|webp|svg|mp4|webm|flac|mp3|wav|ogg|aac|eot|[t|o]tf|woff2?)$': transform.stub,
    '\\.((sa|sc|c|le)ss|styl(us)?)$': transform.stub,
  },
  snapshotSerializers: [
    'jest-serializer-vue',
  ],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  globals: {
    'ts-jest': {
      // configurations for ts-jest
      diagnostics: true,
    },
  },
  //collectCoverage: true,
  collectCoverageFrom: [
    ...roots.map(item => `${item}/**/*`),
    '!<rootDir>/src/assets/**/*',
  ],
};

function mapConfig<T extends any> (config: T): T {
  if (config.moduleNameMapper) {
    Object.keys(config.moduleNameMapper)
      .map((key: string) => {
        config.moduleNameMapper[key] = config.moduleNameMapper[key]
          .replace(/<moduleDir>/, paths.ownNodeModules)
      });
  }
  return config;
}

// 프로젝트 내 package.json > jest 설정 혹은 jest.config.js 파일이 존재하면
// 기본설정에 overwrite, 정책상 불필요한 부분이면 아래 내용을 제거한다.
let config;
if (isFileExist(`${paths.appPath}/jest.config.js`)) {
  config = (async () => {
    const jestConfig = await import(`${paths.appPath}/jest.config.js`);
    return deepmerge(defaultConfig, mapConfig(jestConfig.default));
  })();
} else {
  const packageConfig = require(paths.appPackageJson);
  if (packageConfig.jest) {
    config = deepmerge(defaultConfig, mapConfig(packageConfig.jest));
  } else {
    config = defaultConfig;
  }
}

module.exports = config;
