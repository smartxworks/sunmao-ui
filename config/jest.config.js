module.exports = {
  moduleFileExtensions: ["ts", "js"],
  testMatch: ["<rootDir>/__tests__/**/**.spec.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/lib/", "<rootDir>/lib/"],
  collectCoverage: Boolean(process.env.COVERAGE),
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  coveragePathIgnorePatterns: ["generated"],
};
