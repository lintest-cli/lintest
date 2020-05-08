import { paths } from './paths';

const currReactVersion = require(`${paths.ownNodeModules}/react`).version;

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
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    '@vue/standard',
    '@vue/typescript',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    project: `${paths.appPath}/tsconfig.json`,
  },
  plugins: [
    '@typescript-eslint',
    'jsx-a11y',
    'react',
    'react-hooks',
    'vue',
  ],
  settings: {
    react: {
      createClass: 'createReactClass', // Regex for Component Factory to use, default to "createReactClass"
      pragma: 'React', // Pragma to use, default to "React"
      version: currReactVersion,
    },
  },
  rules: {
    // for js
    'comma-dangle': 'off',
    'prefer-const': 'error',
    'no-console': 'off', // 라이브배포시 빌드오류를 막기 위해 off 한다 (개발완료시점에 console.* 지울것).
    'no-debugger': 'off', // 라이브배포시 빌드오류를 막기 위해 off 한다 (개발완료시점에 debugger 지울것).
    'no-inner-declarations': 'off',
    'no-multi-spaces': 'off',
    'no-return-assign': 'off',
    'no-unused-vars': 'off',
    'padded-blocks': 'off',
    'spaced-comment': 'off',
    'yoda': 'off',
    // for ts
    '@typescript-eslint/indent': ['error', 2],
    // for jsx
    'react/display-name': 'off',
    'react/jsx-boolean-value': 'off',
    'react/jsx-wrap-multilines': 'off',
    // for vue
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
