const puppeteer = require("puppeteer");
const path = require("path");

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const filePath = path.join(process.cwd(), 'test', 'test_runner.html');
    const fileUrl = `file://${filePath}`;

    await page.goto(fileUrl);

    const result = await page.evaluate(() => {
        return QUnit.config.stats.bad === 0;
      });

    await browser.close();

    if (!result){
        console.error("Browser test failed");
        process.exit(1);
    }
})();