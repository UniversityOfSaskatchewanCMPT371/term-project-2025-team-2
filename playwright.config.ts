import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests/playwright',
    timeout: 3000,
    use:{
        headless: true,
        browserName:'firefox'
    }
});