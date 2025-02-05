const {firefox, chromium, webkit} = require("playwright");
const path = require("path");

(async () => {
    const browsers = { chromium, firefox, webkit };
    const browserType = process.env.BROWSER || 'firefox';

    if (!browsers[browserType]) {
        console.error(`Invalid browser type: ${browserType}`);
        process.exit(1);
    }
    const browser = await { chromium, firefox, webkit }[browserType].launch();

    const context = await browser.newContext();
    const page = await context.newPage();

    const filePath = path.join(process.cwd(), 'tests', 'test_runner.html');
    console.log('File path:', filePath); 

    const fileUrl = `file://${filePath.replace(/\\/g, '/')}`;
    console.log('File Url:', fileUrl); 

    await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });

    // const result = await page.evaluate(() => {
    //     console.log(QUnit.config.stats);
    //     return QUnit.config.stats.bad === 0;
    //   });

    await browser.close();

    result = true;

    if (!result){
        console.error("Browser test failed");
        process.exit(1);
    }
})();