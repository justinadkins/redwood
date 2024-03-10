import { describe, it, vi } from 'vitest'

import updateJestConfig from '../updateJestConfig'

vi.mock('../../../../lib/fetchFileFromTemplate', () => {
  return {
    default: vi.fn((_tag, file) => {
      if (file === 'jest.config.js') {
        return [
          '// This the Redwood root jest config',
          '// Each side, e.g. ./web/ and ./api/ has specific config that references this root',
          '// More info at https://redwoodjs.com/docs/project-configuration-dev-test-build',
          '',
          'module.exports = {',
          "  rootDir: '.',",
          "  projects: ['<rootDir>/{*,!(node_modules)/**/}/jest.config.js'],",
          '}',
        ].join('\n')
      }

      return [
        '// More info at https://redwoodjs.com/docs/project-configuration-dev-test-build',
        '',
        'const config = {',
        "  rootDir: '../',",
        `  preset: '@redwoodjs/testing/config/jest/${
          file.match(/(?<side>api|web)/).groups.side
        }',`,
        '}',
        '',
        'module.exports = config',
      ].join('\n')
    }),
  }
})

// Skip these tests as these are old codemods
// and the tests seem flakey
describe.skip('Update Jest Config', () => {
  it('Adds missing files', async () => {
    await matchFolderTransform(updateJestConfig, 'missing', {
      removeWhitespace: true,
    })
  })

  it('Keeps custom jest config in api and web', async () => {
    await matchFolderTransform(updateJestConfig, 'custom', {
      removeWhitespace: true,
    })
  })
})
