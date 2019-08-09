// jest.config.js
module.exports = {
    testURL: 'http://localhost:3000/',
    setupFilesAfterEnv: [
        '<rootDir>specs/jest-setup.js',
    ],
};
