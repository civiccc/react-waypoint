module.exports = {
  globals: {
    afterEach: false,
    beforeEach: false,
    describe: false,
    expect: false,
    it: false,
    jasmine: false,
    spyOn: false,
    xit: false,
  },

  rules: {
    'max-nested-callbacks': [2, 4],
    'react/prop-types': 0,
    'max-classes-per-file': 0,
    'react/jsx-props-no-spreading': 0,
  },
};
