module.exports = {
  maxWorkers: '50%',
  testMatch: ['<rootDir>/__tests__/**/**.spec.[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '<rootDir>/lib/'],
  collectCoverage: Boolean(process.env.COVERAGE),
  collectCoverageFrom: ['<rootDir>/src/**/*.ts?(x)'],
  coveragePathIgnorePatterns: ['generated'],
  /**
   * Since we use a lot of denepencies as ES moules, we need configure
   * jest to transform the files in node_modules which export as
   * ES modules.
   * The list can be very long if we enumerate dependencies as a whitelist,
   * so we use a blacklist to ignore certain dependencies that should
   * not be transformed.
   * This may cause performance issue.
   */
  transformIgnorePatterns: [`/node_modules/(jest|@testing-library)`],
};
