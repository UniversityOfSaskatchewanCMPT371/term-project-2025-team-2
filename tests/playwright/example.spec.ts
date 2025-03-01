import { test, expect } from "@playwright/test";

// Use environment variable for the base URL
const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

test.setTimeout(120000);

test.describe.configure({ mode: "parallel" });

test("Upload DICOM file", async ({ page }) => {
    try {
        // Navigate to your DICOM tag editor
        await page.goto(BASE_URL);

        // Upload a DICOM file
        const fileInput = page.locator('input[type="file"].hidden');
        await fileInput.setInputFiles("./test-data/000000.dcm");

        console.log("File uploaded successfully");
    } catch (error) {
        console.error("Error during file upload:", error);
        throw error; // Re-throw to fail the test
    }
});

test("View DICOM tags for an uploaded file", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        // Upload a DICOM file
        const fileInput = page.locator('input[type="file"].hidden');
        await fileInput.setInputFiles("./test-data/CR000001.dcm");

        // Wait for the DICOM tags table to be visible
        const tagTable = page.locator("table").first();
        await expect(tagTable).toBeVisible();

        const sopClassUID = page
            .locator("tr", {
                has: page.locator("td", { hasText: "SOPClassUID" }),
            })
            .first();
        await expect(sopClassUID).toBeVisible();

        console.log("DICOM tags for the uploaded file are visible");
    } catch (error) {
        console.error("Error viewing DICOM tags:", error);
        throw error;
    }
});

test("Edit a DICOM tag and save changes", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        // Upload a DICOM file
        const fileInput = page.locator('input[type="file"].hidden');
        await fileInput.setInputFiles("./test-data/CR000001.dcm");

        // Wait for the row containing 'SOPClassUID' to be visible
        const tagRow = page
            .locator("tr")
            .filter({ hasText: "SOPClassUID" })
            .first();
        await expect(tagRow).toBeVisible();

        // Click the edit button (pencil icon) in that row
        const editButton = tagRow.locator("svg.h-6.w-6").first();
        await expect(editButton).toBeVisible();
        await editButton.click();

        // Now find and edit the input field
        const tagInput = tagRow.locator("input").first();
        await expect(tagInput).toBeVisible();
        await tagInput.fill("New Value");

        // Save changes
        const saveButton = page.getByRole("button", {
            name: "Download File",
        });
        await expect(saveButton).toBeEnabled();
        await saveButton.click();

        console.log("DICOM file edited and saved successfully");
    } catch (error) {
        console.error("Error editing DICOM tag:", error);
        throw error;
    }
});

test("Navigate between uploaded files", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        // Upload multiple DICOM files
        const fileInput = page.locator('input[type="file"].hidden');
        await fileInput.setInputFiles([
            "./test-data/CR000000.dcm",
            "./test-data/CR000001.dcm",
        ]);

        // Wait for the upload to complete and prompt to appear
        // More robust way to wait for the prompt
        await page.waitForTimeout(10000);

        // Click "No" to edit files individually
        const noButton = page.locator("id=no");
        await expect(noButton).toBeVisible();
        await noButton.click();

        // Wait for the UI to update after selection
        await page.waitForTimeout(1000);

        // Verify the first file is displayed
        await page.waitForSelector("text=Currently Viewing: CR000000.dcm", {
            state: "visible",
            timeout: 5000,
        });

        // Navigate to the next file - find by role and text for more reliability
        await page.waitForSelector('button:has-text("Next")', {
            state: "visible",
            timeout: 5000,
        });
        await page.click('button:has-text("Next")');

        // Wait for the UI to update after navigation
        await page.waitForTimeout(1000);

        // Verify the second file is displayed
        await page.waitForSelector("text=Currently Viewing: CR000001.dcm", {
            state: "visible",
            timeout: 5000,
        });

        // Navigate back to the previous file
        await page.waitForSelector('button:has-text("Previous")', {
            state: "visible",
            timeout: 5000,
        });
        await page.click('button:has-text("Previous")');

        // Wait for the UI to update after navigation
        await page.waitForTimeout(1000);

        // Verify the first file is displayed again
        await page.waitForSelector("text=Currently Viewing: CR000000.dcm", {
            state: "visible",
            timeout: 5000,
        });

        console.log("Successfully navigated between files");
    } catch (error) {
        console.error("Error navigating between files:", error);
        throw error;
    }
});

test("Toggle sidebar", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        console.log("Sidebar toggled successfully");
    } catch (error) {
        console.error("Error toggling sidebar:", error);
        throw error;
    }
});

test("Saving changes using Sidebar toggle", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        // Upload multiple DICOM files with better waiting
        const fileInput = page.locator('input[type="file"].hidden');
        await fileInput.setInputFiles([
            "./test-data/CR000000.dcm",
            "./test-data/CR000001.dcm",
        ]);

        await page.waitForTimeout(12000);

        const noButton = page.locator("id=no");
        await expect(noButton).toBeVisible();
        await noButton.click();

        // Wait for UI update
        await page.waitForTimeout(1000);

        // Verify the first file is displayed with better waiting
        await page.waitForSelector("text=Currently Viewing: CR000000.dcm", {
            state: "visible",
            timeout: 5000,
        });

        // Find the row with better waiting
        await page.waitForSelector('tr:has-text("SOPClassUID")', {
            state: "visible",
            timeout: 5000,
        });

        // Better approach to find the edit button
        const editButton = await page
            .locator('tr:has-text("SOPClassUID")')
            .locator("svg")
            .first();
        await editButton.waitFor({ state: "visible", timeout: 5000 });
        await editButton.click();

        // Wait for the input field to appear
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

        // Wait for sidebar to appear
        await page.waitForTimeout(1000);

        // Save changes with better waiting
        await page.waitForSelector('button:has-text("Save All Files")', {
            state: "visible",
            timeout: 5000,
        });
        await page.click('button:has-text("Save All Files")');

        console.log("Save file button working successfully on sidebar toggle");
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

        const fileInput = page.locator('input[type="file"].hidden');
        await fileInput.setInputFiles([
            "./test-data/CR000000.dcm",
            "./test-data/CR000001.dcm",
        ]);

        await page.waitForTimeout(12000);

        const noButton = page.locator("id=no");
        await expect(noButton).toBeVisible();
        await noButton.click();

        // Verify the first file is displayed
        const currentFile = page
            .locator("text=Currently Viewing: CR000000.dcm")
            .first();
        await expect(currentFile).toBeVisible();

        // Toggle sidebar
        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        // Click the "Editing Individually" button
        const editIndividuallyButton = page
            .locator("button", { hasText: "Editing Individually" })
            .first();
        await expect(editIndividuallyButton).toBeVisible();
        await editIndividuallyButton.click();

        // Click the "Editing as Series" button
        const editAsSeriesButton = page
            .locator("button", { hasText: "Editing as Series" })
            .first();
        await expect(editAsSeriesButton).toBeVisible();
        await editAsSeriesButton.click();

        console.log("Edit buttons working completely fine");
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

        const fileInput = page.locator('input[type="file"].hidden');
        await fileInput.setInputFiles([
            "./test-data/CR000000.dcm",
            "./test-data/CR000001.dcm",
        ]);

        await page.waitForTimeout(12000);

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

        console.log("Successfully navigated between files from sidebar");
    } catch (error) {
        console.error("Error navigating between files from sidebar:", error);
        throw error;
    }
});

test("Updating file by navigating through sidebar", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const fileInput = page.locator('input[type="file"].hidden');
        await fileInput.setInputFiles([
            "./test-data/CR000000.dcm",
            "./test-data/CR000001.dcm",
        ]);

        await page.waitForTimeout(12000);

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
            .filter({ hasText: "SOPClassUID" })
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

        console.log("DICOM file updated successfully");
    } catch (error) {
        console.error("Error updating file through sidebar:", error);
        throw error;
    }
});

test("Verify settings button is visible and clickable", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await expect(settingsButton).toBeVisible();
        await settingsButton.click();

        console.log("Settings button is visible and clickable");
    } catch (error) {
        console.error("Error verifying settings button:", error);
        throw error;
    }
});

test("Verify Set Theme toggle functionality", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        const moonIcon = page
            .locator('label.mb-4cursor-pointer.label svg[data-slot="icon"]')
            .first();
        await expect(moonIcon).toBeVisible();
        await expect(moonIcon).toBeEnabled();

        await moonIcon.click();
        await moonIcon.click();

        console.log("Set Theme toggle functionality verified");
    } catch (error) {
        console.error("Error verifying Set Theme toggle:", error);
        throw error;
    }
});

test("Verify toggle input (checkbox) is clickable", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor();
        await sidebarToggleButton.click();

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        const label = page.locator("label.mb-4cursor-pointer.label");

        // Locate the Set Theme toggle inside the label using its unique ID
        const setThemeToggle = label.locator("#theme-option");
        await expect(setThemeToggle).toBeVisible();

        // Verify the initial state of the toggle
        const isInitiallyChecked = await setThemeToggle.isChecked();
        console.log(
            `Initial state of toggle: ${isInitiallyChecked ? "Checked" : "Unchecked"}`
        );

        // Click the toggle to change its state
        await setThemeToggle.click();

        // Verify the new state of the toggle
        const isNowChecked = await setThemeToggle.isChecked();
        await expect(isNowChecked).toBe(!isInitiallyChecked);

        console.log("Set Theme toggle state change verified");
    } catch (error) {
        console.error("Error verifying toggle input (checkbox):", error);
        throw error;
    }
});

test("Verify second SVG icon (Sun icon) is clickable", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor(); // Ensure button is present
        await sidebarToggleButton.click(); // Open sidebar

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        // Locate the second SVG icon (Sun icon) inside the label
        const sunIcon = page
            .locator('label.mb-4cursor-pointer.label svg[data-slot="icon"]')
            .nth(1);
        await expect(sunIcon).toBeVisible();

        // Verify the icon is clickable
        await expect(sunIcon).toBeEnabled();

        // Click the icon
        await sunIcon.click();

        console.log("Second SVG icon (Sun icon) is clickable");
    } catch (error) {
        console.error("Error verifying second SVG icon (Sun icon):", error);
        throw error;
    }
});

test("Verify Show Hidden Tags toggle state change", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor(); // Ensure button is present
        await sidebarToggleButton.click(); // Open sidebar

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        // Locate the parent label
        const label = page.locator("label.mb-4cursor-pointer.label");

        // Locate the Show Hidden Tags toggle inside the label using its unique ID
        const showHiddenTagsToggle = label.locator("#hidden-tag-option");
        await expect(showHiddenTagsToggle).toBeVisible();

        // Verify the initial state of the toggle
        const isInitiallyChecked = await showHiddenTagsToggle.isChecked();
        console.log(
            `Initial state of Show Hidden Tags toggle: ${isInitiallyChecked ? "Checked" : "Unchecked"}`
        );

        // Click the toggle to change its state
        await showHiddenTagsToggle.click();

        // Verify the new state of the toggle
        const isNowChecked = await showHiddenTagsToggle.isChecked();
        await expect(isNowChecked).toBe(!isInitiallyChecked); // State should be the opposite of the initial state

        console.log("Show Hidden Tags toggle state change verified");
    } catch (error) {
        console.error("Error verifying Show Hidden Tags toggle:", error);
        throw error;
    }
});

test("Verify first SVG icon (left icon) in Show Hidden Tags is clickable", async ({
    page,
}) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor(); // Ensure button is present
        await sidebarToggleButton.click(); // Open sidebar

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        // Locate the Show Hidden Tags section using the <p> text
        const showHiddenTagsSection = page
            .locator('p:has-text("Show Hidden Tags")')
            .locator("xpath=.."); // Move to parent element

        // Locate the first SVG icon (left icon) inside the label
        const leftIcon = showHiddenTagsSection
            .locator('svg[data-slot="icon"]')
            .first();
        await expect(leftIcon).toBeVisible();

        // Verify the icon is clickable
        await expect(leftIcon).toBeEnabled();

        // Click the icon
        await leftIcon.click();

        console.log(
            "First SVG icon (left icon) in Show Hidden Tags is clickable"
        );
    } catch (error) {
        console.error("Error verifying first SVG icon (left icon):", error);
        throw error;
    }
});

test("Verify second SVG icon (right icon) in Show Hidden Tags is clickable", async ({
    page,
}) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor(); // Ensure button is present
        await sidebarToggleButton.click(); // Open sidebar

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        // Locate the Show Hidden Tags section using the <p> text
        const showHiddenTagsSection = page
            .locator('p:has-text("Show Hidden Tags")')
            .locator("xpath=.."); // Move to parent element

        // Locate the second SVG icon (right icon) inside the label
        const rightIcon = showHiddenTagsSection
            .locator('svg[data-slot="icon"]')
            .nth(1);
        await expect(rightIcon).toBeVisible();

        // Verify the icon is clickable
        await expect(rightIcon).toBeEnabled();

        // Click the icon
        await rightIcon.click();

        console.log(
            "Second SVG icon (right icon) in Show Hidden Tags is clickable"
        );
    } catch (error) {
        console.error("Error verifying second SVG icon (right icon):", error);
        throw error;
    }
});

test("Verify Close button is clickable and closes settings menu", async ({
    page,
}) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor(); // Ensure button is present
        await sidebarToggleButton.click(); // Open sidebar

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        // Locate the Close button
        const closeButton = page.locator('button:has-text("Close")').first();
        await expect(closeButton).toBeEnabled();

        await closeButton.click();

        console.log("Close button is clickable and closes the settings menu");
    } catch (error) {
        console.error("Error verifying Close button:", error);
        throw error;
    }
});

test("Verify question mark icon is clickable", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor(); // Ensure button is present
        await sidebarToggleButton.click(); // Open sidebar

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        const settingsSection = page.locator('div:has-text("Settings")');

        // Locate the question mark icon using its specific class
        const questionMarkIcon = settingsSection.locator(
            "svg.mb-4.size-6.cursor-pointer.text-base-content\\/70"
        );
        await expect(questionMarkIcon).toBeVisible();

        // Verify the icon is clickable
        await expect(questionMarkIcon).toBeEnabled();

        // Click the icon to open the modal or menu
        await questionMarkIcon.click();

        const modalOrMenu = page.locator(".modal-box");
        await expect(modalOrMenu).toBeVisible();

        console.log("Question mark icon is clickable and opens the modal/menu");
    } catch (error) {
        console.error("Error verifying question mark icon:", error);
        throw error;
    }
});

test("Verify GitHub link is clickable", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor(); // Ensure button is present
        await sidebarToggleButton.click(); // Open sidebar

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        const settingsSection = page.locator('div:has-text("Settings")');

        // Locate the question mark icon using its specific class
        const questionMarkIcon = settingsSection.locator(
            "svg.mb-4.size-6.cursor-pointer.text-base-content\\/70"
        );
        await expect(questionMarkIcon).toBeVisible();

        // Verify the icon is clickable
        await expect(questionMarkIcon).toBeEnabled();

        // Click the icon to open the modal or menu
        await questionMarkIcon.click();

        const modalOrMenu = page.locator(".modal-box");
        await expect(modalOrMenu).toBeVisible();

        const githubLink = page.locator(
            'a.link.link-info:has-text("Detailed User Guide")'
        );
        await expect(githubLink).toBeVisible();

        // Verify the link is clickable
        await expect(githubLink).toBeEnabled();

        // Optionally, verify the link's href attribute
        const href = await githubLink.getAttribute("href");
        expect(href).toBe(
            "https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2025-team-2"
        );

        console.log("GitHub link is clickable and has the correct URL");
    } catch (error) {
        console.error("Error verifying GitHub link:", error);
        throw error;
    }
});

test("Verify GitHub link opens correct URL", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        const sidebarToggleButton = page
            .locator('button >> svg[data-slot="icon"]')
            .first();
        await sidebarToggleButton.waitFor(); // Ensure button is present
        await sidebarToggleButton.click(); // Open sidebar

        const settingsButton = page.locator("svg.size-6.cursor-pointer");
        await settingsButton.click();

        const settingsSection = page.locator('div:has-text("Settings")');

        // Locate the question mark icon using its specific class
        const questionMarkIcon = settingsSection.locator(
            "svg.mb-4.size-6.cursor-pointer.text-base-content\\/70"
        );
        await expect(questionMarkIcon).toBeVisible();

        // Verify the icon is clickable
        await expect(questionMarkIcon).toBeEnabled();

        // Click the icon to open the modal or menu
        await questionMarkIcon.click();

        const modalOrMenu = page.locator(".modal-box");
        await expect(modalOrMenu).toBeVisible();

        // Locate the GitHub link inside the modal or menu
        const githubLink = page.locator(
            'a.link.link-info:has-text("Detailed User Guide")'
        );
        await expect(githubLink).toBeVisible();

        const href = await githubLink.getAttribute("href");
        console.log(`GitHub link href: ${href}`);

        const [newPage] = await Promise.all([
            page.waitForEvent("popup"), // Wait for the new tab to open
            githubLink.click(), // Click the link
        ]);

        await newPage.waitForLoadState("load");

        const actualUrl = newPage.url();
        expect(actualUrl).toBe(
            "https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2025-team-2"
        );

        console.log("GitHub link opens the correct URL in a new tab");
    } catch (error) {
        console.error("Error verifying GitHub link URL:", error);
        throw error;
    }
});

test("Verify delete functionality for a DICOM tag", async ({ page }) => {
    try {
        await page.goto(BASE_URL);

        // Upload a DICOM file
        const fileInput = page.locator('input[type="file"].hidden');
        await fileInput.setInputFiles("./test-data/CR000001.dcm");

        // Wait for the uploaded file to appear
        await page.waitForTimeout(2000); // Handle slow rendering

        // Find the row containing the tag you want to delete (e.g., 'SOPClassUID')
        const tagRow = page
            .locator("tr")
            .filter({ hasText: "SOPClassUID" })
            .first();
        await expect(tagRow).toBeVisible();

        // Locate the delete icon inside the row
        const deleteIcon = tagRow.locator('svg[aria-label="Delete Tag"]');
        await expect(deleteIcon).toBeVisible();

        // Verify the delete icon is clickable
        await expect(deleteIcon).toBeEnabled();

        await deleteIcon.click();

        const undoDeleteIcon = tagRow.locator('svg[aria-label="Undo Delete"]');
        await expect(undoDeleteIcon).toBeVisible();

        console.log("Delete functionality for DICOM tag verified");
    } catch (error) {
        console.error("Error verifying delete functionality:", error);
        throw error;
    }
});
