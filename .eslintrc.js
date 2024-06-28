module.exports = {
  root: true,
  extends: [
    '@react-native-community', 
    'prettier', 
  ],
  plugins: ['react', 'react-native', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
    node: true,
    'react-native/react-native': true,
  },
  rules: {
    // Custom role
    'prettier/prettier': ['error', {
      arrowParens: 'avoid',
      bracketSameLine: true,
      bracketSpacing: false,
      singleQuote: true,
      trailingComma: 'all',
    }],
  },
};