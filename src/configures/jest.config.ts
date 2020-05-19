import deepmerge from 'deepmerge';
import { Config } from '@jest/types';
import { paths } from './paths';
import { isFileExist, getFilteredExistPaths } from '../methods/file';

const transform = {
  tsjest: `${paths.ownNodeModules}/ts-jest`,
  stub: `${paths.ownNodeModules}/jest-transform-stub`,
  vuejest: `${paths.ownNodeModules}/vue-jest`,
};

// Gets test roots path
const testRoots = getFilteredExistPaths(paths.appPath, [
  '/src',
  '/src/test',
  '/src/tests',
  '/test',
  '/tests',
]);

// Gets test-setup files in test roots path
const setupFiles = [
  // root test-setup file
  ...getFilteredExistPaths(paths.appPath, ['/test-setup.*']),
  // subdir @setup.* files
  ...getFilteredExistPaths(paths.appPath, testRoots.map((root: string) => `${root}/@setup.*`)),
].map((p: string) => `<rootDir>${p}`);

// Finally insert root path
if (!testRoots.length) {
  testRoots.push('');
}
const roots = testRoots.map((p: string) => `<rootDir>${p}`);

// use "module.exports" (do not "export default")
const defaultConfig: Config.InitialOptions = {
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
    `${paths.ownNodeModules}/jest-serializer-vue`,
  ],
  globals: {
    'ts-jest': {
      // configurations for ts-jest
      diagnostics: true,
    },
  },
  collectCoverageFrom: [
    ...roots.map(item => `${item}/**/*.{js,jsx}`),
    '!<rootDir>/coverage/**',
    '!<rootDir>/dist/**',
    '!<rootDir>/build/**',
    '!<rootDir>/out/**',
    '!<rootDir>/public/**',
    '!<rootDir>/node_modules/**',
    '!<rootDir>/.idea/**',
    '!<rootDir>/.vscode/**',
    '!<rootDir>/.git/**',
    '!<rootDir>/src/assets/**',
  ],
};

function mapConfig<T extends Config.InitialOptions> (config: T): T {
  const moduleNameMapper: Config.InitialOptions['moduleNameMapper'] = config.moduleNameMapper;
  if (moduleNameMapper) {
    config.moduleNameMapper = Object.entries(moduleNameMapper)
      .map((item) => {
        if (Array.isArray(item[1])) {
          item[1].map((subItem: string) => subItem.replace(/<moduleDir>/, paths.ownNodeModules));
        } else {
          item[1].replace(/<moduleDir>/, paths.ownNodeModules);
        }
        return item;
      })
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  }
  return config;
}

// 프로젝트 내 package.json > jest 설정 혹은 jest.config.js 파일이 존재하면
// 기본설정에 overwrite, 정책상 불필요한 부분이면 아래 내용을 제거한다.
let config: Config.InitialOptions;
if (isFileExist(`${paths.appPath}/jest.config.js`)) {
  config = (() => {
    const jestConfig = require(`${paths.appPath}/jest.config.js`);
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
