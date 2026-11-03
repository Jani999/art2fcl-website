import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 60000,
  use: {
    baseURL: process.env.TEST_BASE_URL || "http://127.0.0.1:3000",
    headless: true,
    channel: "msedge",
  },
  workers: 1,
  reporter: "list",
  webServer: process.env.TEST_BASE_URL
    ? undefined
    : {
        command: "node scripts/serve.mjs",
        port: 3000,
        reuseExistingServer: true,
      },
});
