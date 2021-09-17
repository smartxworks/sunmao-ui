const path = require('path');

module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  testEnvironment: 'node',
  maxWorkers: '50%',
  rootDir: process.cwd(),
  // The UI and server packages should follow its jest config
  projects: ['<rootDir>/packages/core', '<rootDir>/packages/runtime'],
  collectCoverage: true, 
  collectCoverageFrom: ['**/src/**/*.ts'],
  coveragePathIgnorePatterns: [],
  coverageReporters: ['text-summary', 'lcov'],
  coverageThreshold: {
    global: {
      //FIXME: increase the threshold to 
      branches: 0,
      functions: 0,
      lines: 0,
      //   statements: -5,
    },
  },
  reporters:
    process.env.CI_COMMIT_REF_NAME === 'master' ||
    process.env.CI_BUILD_REF_NAME === 'master'
      ? ['default', '<rootDir>/config/testrail-reporter.js']
      : undefined,
};
