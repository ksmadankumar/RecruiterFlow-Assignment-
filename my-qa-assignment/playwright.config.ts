import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'api', testDir: './tests/api', use: { baseURL: process.env.API_BASE_URL || 'https://reqres.in', extraHTTPHeaders: process.env.REQRES_API_KEY ? { 'x-api-key': process.env.REQRES_API_KEY } : {} } },
    { name: 'chromium', testDir: './tests/ui', use: { browserName: 'chromium', baseURL: process.env.UI_BASE_URL || 'https://www.saucedemo.com' } },
  ],
});
