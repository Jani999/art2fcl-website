import {defineConfig} from '@playwright/test';
const publishing=!!process.env.PORTFOLIO_PUBLISH,port=publishing?4175:4173;
export default defineConfig({testDir:'./tests/portfolio',workers:1,timeout:60000,reporter:'list',use:{baseURL:`http://127.0.0.1:${port}`,headless:true,browserName:process.env.TEST_ENGINE==='firefox'?'firefox':'chromium',channel:process.env.CI||process.env.TEST_ENGINE==='firefox'?undefined:'msedge'},webServer:{command:`node scripts/serve-portfolio.mjs ${publishing?'dist':'.local/claude-preview'} ${port}`,port,reuseExistingServer:!process.env.CI}});
