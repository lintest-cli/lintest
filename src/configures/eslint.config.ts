import { paths, targetFileExtensions } from './paths';

const versions = {
  jest: require(`${paths.ownNodeModules}/jest/package.json`).version,
  react: require(`${paths.ownNodeModules}/react/package.json`).version,
};

// use "module.exports" (do not "export default")
module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
    commonjs: true,
    jest: true, // Set globally because it is not applied to overrides
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
    project: `${paths.appPath}/tsconfig.json`,
  },
  extends: [
    // node plugin은 standard plugin에서 사용하므로 여기서 선언하지 않는다 (eslint-plugin-node).
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:json/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:promise/recommended',
    'plugin:react/recommended',
    'plugin:vue/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    '@vue/standard',
    '@vue/typescript',
  ],
  plugins: [
    '@typescript-eslint',
    'import',
    'jest',
    'json',
    'jsx-a11y',
    'node',
    'promise',
    'standard',
    'unicorn',
    'react',
    'react-hooks',
    'vue',
  ],
  settings: {
    jest: {
      version: versions.jest,
    },
    react: {
      createClass: 'createReactClass', // Regex for Component Factory to use, default to "createReactClass"
      pragma: 'React', // Pragma to use, default to "React"
      version: versions.react,
    },
    'import/extensions': targetFileExtensions.map(ext => `.${ext}`),
  },
  ignorePatterns: [], // .eslintignore 파일 사용시 매핑됨
  rules: {
    // general
    'comma-dangle': 'off',
    'prefer-const': 'error',
    'no-console': 'off', // 라이브배포시 빌드오류를 막기 위해 off 한다 (개발완료시점에 console.* 지울것).
    'no-debugger': 'off', // 라이브배포시 빌드오류를 막기 위해 off 한다 (개발완료시점에 debugger 지울것).
    'no-empty': 'warn',
    'no-inner-declarations': 'off',
    'no-multi-spaces': 'off',
    'no-return-assign': 'off',
    'no-unused-expressions': 'off', // @typescript-eslint/no-unused-expressions 사용
    'no-unused-vars': 'off',
    'padded-blocks': 'off',
    'require-await': 'error',
    'semi': 'off',
    'spaced-comment': 'off',
    'yoda': 'off',
    // promise
    'promise/valid-params': 'off',
    // react
    'react/display-name': 'off',
    'react/jsx-boolean-value': 'off',
    'react/jsx-wrap-multilines': 'off',
    // standard
    'standard/no-callback-literal': 'off',
    // typescript
    '@typescript-eslint/indent': ['error', 2],
    // unicorn
    'unicorn/escape-case': 'error',
    'unicorn/no-array-instanceof': 'error',
    'unicorn/number-literal-case': 'error',
    // vue
    'vue/attribute-hyphenation': 'off',
    'vue/html-closing-bracket-spacing': 'off',
    'vue/html-indent': ['error', 2],
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/no-parsing-error': ['error', {
      'control-character-in-input-stream': false,
    }],
    'vue/no-v-html': 'off',
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'off',
    'vue/singleline-html-element-content': 'off',
    'vue/singleline-html-element-content-newline': 'off',
  },
};
