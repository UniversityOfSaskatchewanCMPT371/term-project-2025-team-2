import test, { expect } from "@playwright/test";

// Use environment variable for the base URL
export const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

test("Toggle sidebar", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();
    } catch (error) {
        console.error("Error toggling sidebar:", error);
        throw error;
    }
});

test("Saving changes using Sidebar toggle", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const fileInput = page.locator('input[type="file"].hidden').first();
        await fileInput.setInputFiles([
            "./test-data/CR000000.dcm",
            "./test-data/CR000001.dcm",
        ]);

        await page.waitForTimeout(2000);

        await page.waitForSelector("text=Edit Files", {
            state: "visible",
            timeout: 2000,
        });

        const noButton = page.locator("id=no");
        await expect(noButton).toBeVisible();
        await noButton.click();

        await page.waitForSelector("text=Currently Viewing: CR000000.dcm", {
            state: "visible",
            timeout: 5000,
        });

        await page.waitForSelector('tr:has-text("X00080016")', {
            state: "visible",
            timeout: 1000,
        });

        const editButton = page
            .locator('tr:has-text("X00080005")')
            .locator("svg")
            .first();
        await editButton.waitFor({ state: "visible", timeout: 5000 });
        await editButton.click();

        await page.waitForSelector("input[type=text]", {
            state: "visible",
            timeout: 5000,
        });
        await page.fill("input[type=text]", "New Value");

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        await page.waitForSelector('button:has-text("Save All Files")', {
            state: "visible",
            timeout: 1000,
        });
        await page.click('button:has-text("Save All Files")');
    } catch (error) {
        console.error("Error saving changes using sidebar:", error);
        throw error;
    }
});

test("Testing edit individually and series button in sidebar", async ({
    page,
}) => {
    try {
        await page.goto(BASE_URL);

        const fileInput = page.locator('input[type="file"].hidden').first();
        await fileInput.setInputFiles([
            "./test-data/CR000000.dcm",
            "./test-data/CR000001.dcm",
        ]);

        await page.waitForTimeout(2000);

        await page.waitForSelector("text=Edit Files", {
            state: "visible",
            timeout: 2000,
        });

        const noButton = page.locator("id=no");
        await expect(noButton).toBeVisible();
        await noButton.click();

        const currentFile = page
            .locator("text=Currently Viewing: CR000000.dcm")
            .first();
        await expect(currentFile).toBeVisible();

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        const editIndividuallyButton = page
            .locator("button", { hasText: "Editing Individually" })
            .first();
        await expect(editIndividuallyButton).toBeVisible();
        await editIndividuallyButton.click();

        const editAsSeriesButton = page
            .locator("button", { hasText: "Editing as Series" })
            .first();
        await expect(editAsSeriesButton).toBeVisible();
        await editAsSeriesButton.click();
    } catch (error) {
        console.error(
            "Error testing edit individually and series buttons:",
            error
        );
        throw error;
    }
});

test("Navigating from files from sidebar", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const fileInput = page.locator('input[type="file"].hidden').first();
        await fileInput.setInputFiles([
            "./test-data/CR000000.dcm",
            "./test-data/CR000001.dcm",
        ]);

        await page.waitForTimeout(2000);

        await page.waitForSelector("text=Edit Files", {
            state: "visible",
            timeout: 2000,
        });

        const noButton = page.locator("id=no");
        await expect(noButton).toBeVisible();
        await noButton.click();

        const currentFile = page
            .locator("text=Currently Viewing: CR000000.dcm")
            .first();
        await expect(currentFile).toBeVisible();

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        const sidebarFileList = page
            .locator("div.mt-2.rounded-lg")
            .nth(0)
            .locator("table.w-full tbody")
            .first();
        await sidebarFileList.waitFor();

        const firstFile = sidebarFileList.locator("text=CR000000.dcm").first();
        await expect(firstFile).toBeVisible();
        await firstFile.click();

        const currentFileSidebar = page.locator(
            "text=Currently Viewing: CR000000.dcm"
        );
        await expect(currentFileSidebar).toBeVisible();

        const secondFile = sidebarFileList.locator("text=CR000001.dcm").first();
        await expect(secondFile).toBeVisible();
        await secondFile.click();

        await expect(
            page.locator("text=Currently Viewing: CR000001.dcm")
        ).toBeVisible();
    } catch (error) {
        console.error("Error navigating between files from sidebar:", error);
        throw error;
    }
});

test("Updating file by navigating through sidebar", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const fileInput = page.locator('input[type="file"].hidden').first();
        await fileInput.setInputFiles([
            "./test-data/CR000000.dcm",
            "./test-data/CR000001.dcm",
        ]);

        await page.waitForTimeout(2000);

        await page.waitForSelector("text=Edit Files", {
            state: "visible",
            timeout: 2000,
        });

        const noButton = page.locator("id=no");
        await expect(noButton).toBeVisible();
        await noButton.click();

        const currentFile = page
            .locator("text=Currently Viewing: CR000000.dcm")
            .first();
        await expect(currentFile).toBeVisible();

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        const sidebarFileList = page
            .locator("div.mt-2.rounded-lg")
            .nth(0)
            .locator("table.w-full tbody")
            .first();
        await sidebarFileList.waitFor();

        const firstFile = sidebarFileList.locator("text=CR000000.dcm").first();
        await expect(firstFile).toBeVisible();
        await firstFile.click();

        const currentFileSidebar = page
            .locator("text=Currently Viewing: CR000000.dcm")
            .first();
        await expect(currentFileSidebar).toBeVisible();

        const secondFile = sidebarFileList.locator("text=CR000001.dcm").first();
        await expect(secondFile).toBeVisible();
        await secondFile.click();

        await expect(
            page.locator("text=Currently Viewing: CR000001.dcm")
        ).toBeVisible();

        await sidebarToggleButton.click();

        await page.innerHTML("body");

        const tagRow = page
            .locator("tr")
            .filter({ hasText: "X00080020" })
            .first();
        await expect(tagRow).toBeVisible();

        const editButton = tagRow.locator("svg.h-6.w-6").first();
        await expect(editButton).toBeVisible();
        await editButton.click();

        const tagInput = tagRow.locator("input").first();
        await expect(tagInput).toBeVisible();
        await tagInput.fill("New Value");

        const saveButton = page.getByRole("button", {
            name: "Download File",
        });
        await expect(saveButton).toBeEnabled();
        await saveButton.click();
    } catch (error) {
        console.error("Error updating file through sidebar:", error);
        throw error;
    }
});
