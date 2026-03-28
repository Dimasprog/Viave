module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-screens|react-native-safe-area-context|react-native-svg|@react-navigation|@react-native-async-storage)/)',
  ],
};
