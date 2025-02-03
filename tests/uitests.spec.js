// @ts-check
import { test, expect } from '@playwright/test';
import { stat, readFileSync } from 'fs';
const path = require("path");

// TODO: Remove these sample tests. Leaving it for future tester's reference
// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });


// Service worker and UI testing
test('Service worker registered, cached correct urls', async({ baseURL, page }) => {

  await page.goto('/');     // Need http for serviceworker
  const swURL = await page.evaluate(async () => {
		const registration = await navigator.serviceWorker.ready;
		return registration.active?.scriptURL;
	});
	// Confirm the expected service worker script installed.
	expect(swURL).toBe(`${baseURL}/service-worker.js`);

  const cacheContents = await page.evaluate(async () => {
		const cacheState = {};
		for (const cacheName of await caches.keys()) {
			const cache = await caches.open(cacheName);
			const reqs = await cache.keys();
			cacheState[cacheName] = reqs.map((req) => req.url).sort();
		}
		return cacheState;
	});

  // check if cache has all urls. TODO: export these from service-worker.js in some way?
  expect(cacheContents).toEqual({
		'dicom-pwa-cache-v1': [
      `${baseURL}/`,
      `${baseURL}/index.html`,
      `${baseURL}/styles.css`,
      `${baseURL}/app.js`,
      `${baseURL}/icons/icon-192.png`,
      `${baseURL}/icons/icon-512.png`,
      `${baseURL}/script.js`,
      `${baseURL}/loader/loader.js`,
      `${baseURL}/tagDictionary/dictionary.js`,
      `${baseURL}/tagDictionary/standardDataElements.js`,
      `${baseURL}/logger/logger.js`,
		].sort(),
	});
});


test('Sidebar open and close', async({ page }) => {
  await page.goto('/');  
  // Click sidebar button
  const sidebarButton = await page.locator("#sidebarCollapse");
  await sidebarButton.click();
  await page.waitForTimeout(500);

  // Check if side bar opened
  const sidebar = await page.locator('#sidebar');
  var sidebarRightAfterOpen = await sidebar.evaluate(el => el.style.right);
  expect(sidebarRightAfterOpen).toBe('0px');

  // Click button again and check if sidebar collapsed
  await sidebarButton.click();
  await page.waitForTimeout(500);
  sidebarRightAfterOpen = await sidebar.evaluate(el => el.style.right);
  expect(sidebarRightAfterOpen).toBe('-250px');
});


test('File upload functions', async({ page }) => {
  await page.goto('/');
  const dropArea = await page.locator('#drop-area');

  // Test drag motions
  await dropArea.dispatchEvent('dragover');
  const hashover = await dropArea.evaluate(el => el.classList.contains('hover'));
  expect(hashover).toBe(true);

  await dropArea.dispatchEvent('dragleave');
  const hasNoHover = await dropArea.evaluate(el => el.classList.contains('hover'));
  expect(hasNoHover).toBe(false);

  // Test file drop
  const validateTagsTable = async(filename, filepath) => {
    var fsize = '';     // Find file size
    stat(filepath, (err, stats) => {
      if (err) {
        console.log(`File doesn't exist.`)
      } else {
        fsize = (stats.size/1024).toFixed(2);
      }
    });
    await page.waitForTimeout(500);   // wait for table to get loaded
    expect(page.locator('#file-info')).toHaveText('File selected: '+ filename +', Size: '+ fsize + ' KB');
    await expect(page.locator('#dicom-tags')).toBeVisible();
    await expect(page.locator('#tags-body')).not.toBeEmpty();   // Checks if the table of tags is empty or not. TODO: check if input boxes are editable?
  }

  const dragAndDropFile = async (page, selector, filePath, fileName, fileType = '' ) => {
    const buffer = readFileSync(filePath).toString('base64');
  
    const dataTransfer = await page.evaluateHandle(
      async ({ bufferData, localFileName, localFileType }) => {
        const dt = new DataTransfer();
        const blobData = await fetch(bufferData).then((res) => res.blob());
        const file = new File([blobData], localFileName, { type: localFileType });
        dt.items.add(file);
        return dt;
      },
      {
        bufferData: `data:application/octet-stream;base64,${buffer}`,
        localFileName: fileName,
        localFileType: fileType,
      }
    );
    await dropArea.dispatchEvent('drop', { dataTransfer });
  };
  await dragAndDropFile(page, "#drop-area", "./system_test/test_files/CR000001.dcm", "CR000001");
  await validateTagsTable('CR000001', './system_test/test_files/CR000001.dcm');

  
  // Test open file button
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Open File' }).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(path.join(__dirname, '../system_test/test_files/IM0.dcm'));
  await validateTagsTable('IM0.dcm', './system_test/test_files/IM0.dcm');
});

test('Log buttons mock test', async({ page })=> {
  await page.goto('/');

  // Test if the button is present and can be clicked
  await expect(page.locator('#log-file-save')).toBeVisible();
  await page.locator('#log-file-save').click();

  // TODO: test if filechooser is opened by the log button. Currently playwright doesn't support testing window.showSaveFilePicker()
});