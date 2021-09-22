module.exports = {
  maxWorkers: '50%',
  testMatch: ['<rootDir>/__tests__/**/**.spec.[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '<rootDir>/lib/'],
  collectCoverage: Boolean(process.env.COVERAGE),
  collectCoverageFrom: ['<rootDir>/src/**/*.ts?(x)'],
  coveragePathIgnorePatterns: ['generated'],
};
