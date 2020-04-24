// use "module.exports" (not "export default")
module.exports = {
  root: true,
  env: {
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
  },
  plugins: [
    'react',
    'jsx-a11y',
    '@typescript-eslint',
  ],
  settings: {
    react: {
      createClass: 'createReactClass', // Regex for Component Factory to use, default to "createReactClass"
      pragma: 'React', // Pragma to use, default to "React"
      version: 'detect',
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
  },
};
