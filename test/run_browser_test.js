const puppeteer = require("puppeteer");
const path = require("path");

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const filePath = path.join(process.cwd(), 'test', 'test_runner.html');
    console.log('File path:', filePath); 

    const fileUrl = `file://${filePath}`;
    console.log('File Url:', fileUrl); 

    await page.goto(fileUrl);

    const result = await page.evaluate(() => {
        console.log(QUnit.config.stats.bad);
        return QUnit.config.stats.bad === 0;
      });

    await browser.close();

    if (!result){
        console.error("Browser test failed");
        process.exit(1);
    }
})();