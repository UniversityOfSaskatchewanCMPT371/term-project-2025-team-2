const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto("./test/test_runner.html");

    const result = await page.evaluate(() => {
        return QUnit.config.stats.bad === 0;
      });

    await browser.close();

    if (!result){
        console.error("Browser test failed");
        process.exit(1);
    }
})();