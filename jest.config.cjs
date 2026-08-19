module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'html', 'js', 'json'],
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|@angular|@ng-bootstrap|ng2-charts|lodash-es)'],
};
