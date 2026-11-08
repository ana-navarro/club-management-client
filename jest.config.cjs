const { readdirSync, readFileSync, statSync } = require('node:fs')
const { join } = require('node:path')

// Files marked @wip are skipped and left out of coverage (constitution, Principle III).
const findWipFiles = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return findWipFiles(path)
    return /\.tsx?$/.test(name) && readFileSync(path, 'utf8').includes('@wip') ? [path] : []
  })

const wipPatterns = findWipFiles(join(__dirname, 'src')).map((path) =>
  path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
)

module.exports = {
  testEnvironment: 'jest-fixed-jsdom',
  testEnvironmentOptions: { customExportConditions: [''] },
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', ...wipPatterns],
  // react-router and its dependencies only ship as ES modules.
  transformIgnorePatterns: ['/node_modules/(?!(react-router|@remix-run/route-pattern|cookie-es)/)'],
  transform: {
    '^.+\\.(tsx?|m?js)$': [
      '<rootDir>/jest.transform.cjs',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
        },
      },
    ],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/main.tsx',
    '!src/**/*.stories.tsx',
    '!src/**/*.mock.{ts,tsx}',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', ...wipPatterns],
  coverageThreshold: { global: { lines: 90 } },
}
