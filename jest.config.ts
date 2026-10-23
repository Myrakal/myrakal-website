import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const shared = {
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
}

const client = createJestConfig({
  ...shared,
  displayName: 'client',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  testPathIgnorePatterns: ['<rootDir>/src/server/', '<rootDir>/src/app/api/'],
})

const server = createJestConfig({
  ...shared,
  displayName: 'server',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/server/**/*.test.ts', '<rootDir>/src/app/api/**/*.test.ts'],
})

const withAssetStubs = async () => {
  const config = await client()
  const mappers = Object.entries(config.moduleNameMapper ?? {}).filter(([pattern]) => !/svg|webp|jpg/.test(pattern))
  return {
    ...config,
    moduleNameMapper: Object.fromEntries(mappers),
    transform: { '\\.(webp|svg)$': '<rootDir>/tests/asset-transform.cjs', ...config.transform },
  }
}

export default async () => ({ projects: [await withAssetStubs(), await server()] })
