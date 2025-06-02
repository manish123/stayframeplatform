const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle module aliases. next/jest should automatically configure this for most cases.
    // A general alias for @/ pointing to src/ is often sufficient.
    '^@/(.*)$': '<rootDir>/src/$1',
    // Specific aliases can be added if the general one doesn't cover all cases
    // or if there are conflicts, but start with the general one.
    // '^@/components/(.*)$': '<rootDir>/src/components/$1',
    // '^@/config/(.*)$': '<rootDir>/src/config/$1',
    // '^@/data/(.*)$': '<rootDir>/src/data/$1',
    // '^@/store/(.*)$': '<rootDir>/src/store/$1',
    // '^@/types/(.*)$': '<rootDir>/src/types/$1',
    // '^@/app/(.*)$': '<rootDir>/src/app/$1',
  },
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/'], 
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
