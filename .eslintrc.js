module.exports = {
  'extends': 'eslint-config-airbnb',
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': true,
    },
  },
  'rules': {
    'no-restricted-globals': 'off',
    'no-plusplus': 'off',
    'no-underscore-dangle': 'off'
  },
  'env': {
    'browser': true,
  },
};
