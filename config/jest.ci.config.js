module.exports = {
  rootDir: process.cwd(),
  projects: ['<rootDir>/packages/core', '<rootDir>/packages/runtime', '<rootDir>/packages/editor'],
  collectCoverage: true,
  collectCoverageFrom: ['**/src/**/*.[jt]s?(x)'],
  coveragePathIgnorePatterns: [],
  coverageReporters: ['text-summary', 'lcov'],
  coverageThreshold: {
    global: {
      //FIXME: increase the threshold after add unit test
      branches: 0,
      functions: 0,
      lines: 0,
      // statements: -5,
    },
  },
};
