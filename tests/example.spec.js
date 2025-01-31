// @ts-check
import { test, expect } from '@playwright/test';
const path = require("path");

// TODO: Remove dummy tests. Maybe rename this file
test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

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


test('Sidebar toggle', async({ page }) => {
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