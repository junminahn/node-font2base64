module.exports = {
  root: true,
  extends: ['airbnb-base', 'prettier'],
  rules: {
    'global-require': 0,
    'no-await-in-loop': 0,
    'no-console': 0,
    'no-empty': 0,
    'no-lonely-if': 0,
    'no-multi-assign': 0,
    'no-param-reassign': 0,
    'no-plusplus': 0,
    'no-underscore-dangle': 0,
    'no-unused-vars': 0,
    'prefer-destructuring': 0,
  },
  ignorePatterns: ['test.js'],
};
