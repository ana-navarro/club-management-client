import type { TestRunnerConfig } from '@storybook/test-runner'
import { checkA11y, injectAxe } from 'axe-playwright'

declare global {
  interface Window {
    __STORYBOOK_ADDONS_CHANNEL__: { emit(name: string, data: { globals: { theme: string } }): void }
  }
}

const THEMES = ['light', 'dark']

// Checks accessibility, including text contrast, in both themes (spec, criterion 26).
// A story that sets its own theme stays in that theme.
const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page)
  },
  async postVisit(page) {
    for (const theme of THEMES) {
      await page.evaluate((value) => {
        window.__STORYBOOK_ADDONS_CHANNEL__.emit('updateGlobals', { globals: { theme: value } })
      }, theme)
      await page.waitForTimeout(350)
      await checkA11y(page, '#storybook-root', {
        detailedReport: true,
        detailedReportOptions: { html: true },
      })
    }
  },
}

export default config
