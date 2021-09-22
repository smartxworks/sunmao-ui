const path = require('path');
module.exports = {
  ...require('../../config/jest.config'),
  moduleFileExtensions: ['ts', 'js'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.[jt]sx?$': [
      'babel-jest',
      {
        configFile: path.resolve(
          __dirname,
          '../../config/babel.ts.config.js'
        ),
      },
    ],
  },
};
