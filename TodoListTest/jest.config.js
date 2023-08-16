module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setupJest.ts'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  };