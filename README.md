# Lintest
![npm](https://img.shields.io/npm/v/@mornya/lintest)
![node](https://img.shields.io/node/v/@mornya/lintest)
![NPM](https://img.shields.io/npm/l/@mornya/lintest)
<br>Copyright 2020. mornya. All rights reserved.

## About
Integrated lint and test environment project.

## Features
- TypeScript / ES6+ support with [TypeScript](https://www.typescriptlang.org/).
- Linting TypeScript / JavaScript codes with [ESLint](http://eslint.org/).
- Testing codes with [Jest](https://facebook.github.io/jest/).
- All available for Node.js / React.js / Vue.js (Nuxt.js) application

## Installation
해당 라이브러리는 글로벌로 설치하거나 프로젝트 내에 설치할 수 있다.
> `npm` 대신 `yarn` 사용시, 프로젝트 루트 경로에 `package-lock.json` 파일이 존재하면 제거하고 `yarn.lock` 파일만 참조되도록 한다.
```bash
$ npm install --save-dev @mornya/lintest
or
$ yarn add -D @mornya/lintest
```
글로벌 설치를 위해서는 아래와 같이 실행한다.
```bash
$ npm install -g @mornya/lintest
or
$ yarn global add @mornya/lintest
```

## Execution
### CLI
린트 및 테스트 수행은 CLI로 실행한다. lintest가 글로벌 모듈로 설치 되어있는 경우 커맨드라인에서 아래와 같이 실행 할 수 있다.
```bash
# 린트 실행시
$ lintest lint [fix|debug]

# 테스트 실행시
$ lintest test [watch|coverage]
```
애플리케이션 내에서 린트 및 테스트 환경설정 내용이 필요할 경우 `export` 명령을 사용하여 생성된 환경설정 파일을 참조한다.
수행결과는 `./node_modules/.cache/lintest` 하위 경로에 파일이 생성된다.
> 환경설정 및 실행파일의 경로 정보 등이 포함되어 있다.
```bash
$ lintest export
```

### NPM
NPM 프로젝트에서는 `npm run` 명령으로 실행되도록 아래와 같이 package.json 파일 내에 설정한다.
```json
"scripts": {
  "lint": "lintest lint",
  "lint:fix": "lintest lint fix",
  "lint:debug": "lintest lint debug",
  "test": "lintest test",
  "test:watch": "lintest test watch",
  "test:coverage": "lintest test coverage"
}
```

## Test setup files
각 단위 테스트를 수행하기 전 mocking method나 초기 설정을 할 수 있도록 셋업 파일을 추가 할 수 있다.
적용될 테스트 셋업 파일은 아래 목록에서 존재하는 파일을 찾아 사용하게 된다.
> 자세한 내용은 [Jest](https://jestjs.io) 관련 문서를 참고.
```bash
<rootDir>/src/test/@setup.ts (or .js)
<rootDir>/test/@setup.ts (or .js)
<rootDir>/test-setup.ts (or .js)
```

## Change Log
해당 프로젝트의 변경사항은 [CHANGELOG.md](CHANGELOG.md) 파일 참조.

## License
해당 프로젝트의 라이센스는 [LICENSE](LICENSE) 파일 참조.
