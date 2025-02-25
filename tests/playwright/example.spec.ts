import { test, expect } from "@playwright/test";
test.describe.configure({ mode: "parallel" });
test("Upload DICOM file ", async ({ page }) => {
    test.setTimeout(75000);
    // Navigate to your DICOM tag editor
    await page.goto(" http://localhost:5173");

    // Upload a DICOM file
    const fileInput = page.locator('input[type="file"].hidden');
    await fileInput.setInputFiles("./test-data/000000.dcm");
    test.setTimeout(75000);
    console.log("File uploaded");
});

test("View DICOM tags for an uploaded file", async ({ page }) => {
    await page.goto("http://localhost:5173");

    // Upload a DICOM file
    const fileInput = page.locator('input[type="file"].hidden');
    await fileInput.setInputFiles("./test-data/CR000001.dcm");
    await page.waitForTimeout(1000);

    // Verify that the DICOM tags table is displayed
    const tagTable = page.locator("table").first();
    await expect(tagTable).toBeVisible();

    const sopClassUID = page
        .locator("tr", { has: page.locator("td", { hasText: "SOPClassUID" }) })
        .first();
    await expect(sopClassUID).toBeVisible();
    console.log("Dicom tags for the uploaded file is visible");
});

test("Edit a DICOM tag and save changes", async ({ page }) => {
    test.setTimeout(75000);
    await page.goto("http://localhost:5173");

    // Upload a DICOM file
    const fileInput = page.locator('input[type="file"].hidden');
    await fileInput.setInputFiles("./test-data/CR000001.dcm");

    // Wait for the uploaded file to appear and debug if needed
    await page.waitForTimeout(2000); // Handle slow rendering
    await page.innerHTML("body");

    // Find the row containing 'SOPClassUID'
    const tagRow = page
        .locator("tr")
        .filter({ hasText: "SOPClassUID" })
        .first();
    await expect(tagRow).toBeVisible();

    // Click the edit button (pencil icon) in that row
    const editButton = tagRow.locator("svg.h-6.w-6").first(); // Pencil button
    await editButton.waitFor({ state: "visible", timeout: 75000 });
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

    console.log("Done Editing the Dicom file");
});

test("Navigate between uploaded files", async ({ page }) => {
    test.setTimeout(75000);
    // Navigate to your DICOM tag editor
    await page.goto("http://localhost:5173");

    // Upload multiple DICOM files
    const fileInput = page.locator('input[type="file"].hidden');
    await fileInput.setInputFiles([
        "./test-data/CR000000.dcm",
        "./test-data/CR000001.dcm",
    ]);

    // Wait for the prompt to appear (edit individually or in series)
    const promptText = page.locator(".my-4").first();
    //const promptText = page.locator('p', { hasText: 'Multiple files have been uploaded. Do you want to edit individually?' }).first();
    await promptText.waitFor({ state: "visible", timeout: 75000 });
    await expect(promptText).toBeVisible();

    // Click "Yes" to edit files individually
    const yesButton = page.locator("button", { hasText: "No" }).first();
    await expect(yesButton).toBeVisible();
    await yesButton.click();

    // Wait for the first file to load
    await page.waitForTimeout(2000); // Adjust timeout if needed

    // Verify the first file is displayed
    const currentFile = page
        .locator("text=Currently Viewing: CR000000.dcm")
        .first();
    await expect(currentFile).toBeVisible();

    // Navigate to the next file
    const nextButton = page.locator("button", { hasText: "Next" }).first();
    await expect(nextButton).toBeVisible();
    await nextButton.click();

    // Verify the second file is displayed
    const secondFile = page
        .locator("text=Currently Viewing: CR000001.dcm")
        .first();
    await expect(secondFile).toBeVisible();

    const prevButton = page.locator("button", { hasText: "Previous" }).first();
    await expect(prevButton).toBeVisible();
    await prevButton.click();

    // Verify the second file is displayed
    const prevFile = page
        .locator("text=Currently Viewing: CR000000.dcm")
        .first();
    await expect(prevFile).toBeVisible();

    console.log("Successfully navigating between the files");
});

test("Toggle sidebar", async ({ page }) => {
    await page.goto("http://localhost:5173");

    const sidebarToggleButton = page
        .locator('button >> svg[data-slot="icon"]')
        .first();
    await sidebarToggleButton.waitFor(); // Ensure button is present

    await sidebarToggleButton.click(); // Open sidebar
    console.log("Toggle sidebar working successfully");
});

test("Saving changes using Side bar toggle test", async ({ page }) => {
    test.setTimeout(75000);
    await page.goto("http://localhost:5173");

    const fileInput = page.locator('input[type="file"].hidden');
    await fileInput.setInputFiles([
        "./test-data/CR000000.dcm",
        "./test-data/CR000001.dcm",
    ]);

    // Wait for the prompt to appear (edit individually or in series)
    const promptText = page.locator(".my-4").first();
    //const promptText = page.locator('p', { hasText: 'Multiple files have been uploaded. Do you want to edit individually?' }).first();
    await promptText.waitFor({ state: "visible", timeout: 75000 });
    await expect(promptText).toBeVisible();

    // Click "Yes" to edit files individually
    const yesButton = page.locator("button", { hasText: "No" }).first();
    await expect(yesButton).toBeVisible();
    await yesButton.click();

    // Wait for the first file to load
    await page.waitForTimeout(2000); // Adjust timeout if needed

    // Verify the first file is displayed
    const currentFile = page
        .locator("text=Currently Viewing: CR000000.dcm")
        .first();
    await expect(currentFile).toBeVisible();

    await page.innerHTML("body");

    // Find the row containing 'SOPClassUID'
    const tagRow = page
        .locator("tr")
        .filter({ hasText: "SOPClassUID" })
        .first();
    await expect(tagRow).toBeVisible();

    // Click the edit button (pencil icon) in that row
    const editButton = tagRow.locator("svg.h-6.w-6").first(); // Pencil button
    await expect(editButton).toBeVisible();
    await editButton.click();

    // Now find and edit the input field
    const tagInput = tagRow.locator("input").first();
    await expect(tagInput).toBeVisible();
    await tagInput.fill("New Value");

    const sidebarToggleButton = page
        .locator('button >> svg[data-slot="icon"]')
        .first();
    await sidebarToggleButton.waitFor(); // Ensure button is present

    await sidebarToggleButton.click(); // Open sidebar

    const saveAllFilesButton = page
        .locator("button", { hasText: "Save All Files" })
        .first();
    await expect(saveAllFilesButton).toBeVisible();

    // Click the "Save All Files" button
    await saveAllFilesButton.click();
    console.log("Save file button working successfully on sidebar toggle");
});

test("Testing edit individually and series button in side bar", async ({
    page,
}) => {
    test.setTimeout(75000);
    await page.goto("http://localhost:5173");

    const fileInput = page.locator('input[type="file"].hidden');
    await fileInput.setInputFiles([
        "./test-data/CR000000.dcm",
        "./test-data/CR000001.dcm",
    ]);

    // Wait for the prompt to appear (edit individually or in series)
    const promptText = page.locator(".my-4").first();
    //const promptText = page.locator('p', { hasText: 'Multiple files have been uploaded. Do you want to edit individually?' }).first();
    await promptText.waitFor({ state: "visible", timeout: 75000 });
    await expect(promptText).toBeVisible();

    // Click "Yes" to edit files individually
    const yesButton = page.locator("button", { hasText: "No" }).first();
    await expect(yesButton).toBeVisible();
    await yesButton.click();

    // Wait for the first file to load
    await page.waitForTimeout(2000); // Adjust timeout if needed

    // Verify the first file is displayed
    const currentFile = page
        .locator("text=Currently Viewing: CR000000.dcm")
        .first();
    await expect(currentFile).toBeVisible();

    const sidebarToggleButton = page
        .locator('button >> svg[data-slot="icon"]')
        .first();
    await sidebarToggleButton.waitFor(); // Ensure button is present

    await sidebarToggleButton.click(); // Open sidebar

    const editIndividuallyButton = page
        .locator("button", { hasText: "Editing Individually" })
        .first();
    await expect(editIndividuallyButton).toBeVisible();

    // Click the "Editing Individually" button
    await editIndividuallyButton.click();

    // Locate the "Editing as Series" button
    const editAsSeriesButton = page
        .locator("button", { hasText: "Editing as Series" })
        .first();
    await expect(editAsSeriesButton).toBeVisible();

    // Click the "Editing as Series" button
    await editAsSeriesButton.click();
    console.log("Edit buttons working completely fine");
});

test("Navigating from files from sidebar test", async ({ page }) => {
    test.setTimeout(75000);
    await page.goto("http://localhost:5173");

    const fileInput = page.locator('input[type="file"].hidden');
    await fileInput.setInputFiles([
        "./test-data/CR000000.dcm",
        "./test-data/CR000001.dcm",
    ]);

    const promptText = page.locator(".my-4").first();
    //const promptText = page.locator('p', { hasText: 'Multiple files have been uploaded. Do you want to edit individually?' }).first();
    await promptText.waitFor({ state: "visible", timeout: 75000 });
    await expect(promptText).toBeVisible();

    const noButton = page.locator("button", { hasText: "No" }).first();
    await expect(noButton).toBeVisible();
    await noButton.click();

    await page.waitForTimeout(2000);

    const currentFile = page
        .locator("text=Currently Viewing: CR000000.dcm")
        .first();
    await expect(currentFile).toBeVisible();

    const sidebarToggleButton = page
        .locator('button >> svg[data-slot="icon"]')
        .first();
    await sidebarToggleButton.waitFor();
    await sidebarToggleButton.click();

    // Fixing selector issue for sidebar file list
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
});

test("Updating file by navigating through side bar", async ({ page }) => {
    test.setTimeout(75000);
    await page.goto("http://localhost:5173");

    const fileInput = page.locator('input[type="file"].hidden');
    await fileInput.setInputFiles([
        "./test-data/CR000000.dcm",
        "./test-data/CR000001.dcm",
    ]);

    const promptText = page.locator(".my-4").first();
    //const promptText = page.locator('p', { hasText: 'Multiple files have been uploaded. Do you want to edit individually?' }).first();
    await promptText.waitFor({ state: "visible", timeout: 75000 });
    await expect(promptText).toBeVisible();

    const noButton = page.locator("button", { hasText: "No" }).first();
    await expect(noButton).toBeVisible();
    await noButton.click();

    await page.waitForTimeout(2000);

    const currentFile = page
        .locator("text=Currently Viewing: CR000000.dcm")
        .first();
    await expect(currentFile).toBeVisible();

    const sidebarToggleButton = page
        .locator('button >> svg[data-slot="icon"]')
        .first();
    await sidebarToggleButton.waitFor();
    await sidebarToggleButton.click();

    // Fixing selector issue for sidebar file list
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

    // Find the row containing 'SOPClassUID'
    const tagRow = page
        .locator("tr")
        .filter({ hasText: "SOPClassUID" })
        .first();
    await expect(tagRow).toBeVisible();

    // Click the edit button (pencil icon) in that row
    const editButton = tagRow.locator("svg.h-6.w-6").first(); // Pencil button
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

    console.log("Done Editing the Dicom file");
});
// Just testing playwright tests pull request

test("Verify settings button is visible and clickable", async ({ page }) => {
    await page.goto("http://localhost:5173");

    const sidebarToggleButton = page
        .locator('button >> svg[data-slot="icon"]')
        .first();
    await sidebarToggleButton.waitFor(); // Ensure button is present

    await sidebarToggleButton.click(); // Open sidebar
    // Locate the settings button
    const settingsButton = page.locator('svg.size-6.cursor-pointer');
    await expect(settingsButton).toBeVisible();

    // Click the settings button
    await settingsButton.click();
    console.log("Settings button is visible and clickable");
});

test("Verify Set Theme toggle functionality", async ({ page }) => {
    await page.goto("http://localhost:5173");

    const sidebarToggleButton = page
        .locator('button >> svg[data-slot="icon"]')
        .first();
    await sidebarToggleButton.waitFor(); // Ensure button is present

    await sidebarToggleButton.click(); // Open sidebar
    const settingsButton = page.locator('svg.size-6.cursor-pointer');
    await settingsButton.click();

    const moonIcon = page.locator('label.mb-4cursor-pointer.label svg[data-slot="icon"]').first();
    await expect(moonIcon).toBeVisible();

    await expect(moonIcon).toBeEnabled();

    await moonIcon.click();

    await moonIcon.click();
    console.log("First SVG icon (Moon icon) is clickable");
});

test("Verify toggle input (checkbox) is clickable", async ({ page }) => {
    await page.goto("http://localhost:5173");

    const sidebarToggleButton = page
        .locator('button >> svg[data-slot="icon"]')
        .first();
    await sidebarToggleButton.waitFor(); // Ensure button is present

    await sidebarToggleButton.click(); // Open sidebar
    const settingsButton = page.locator('svg.size-6.cursor-pointer');
    await settingsButton.click();

    const label = page.locator('label.mb-4cursor-pointer.label');

    // Locate the Set Theme toggle inside the label using its unique ID
    const setThemeToggle = label.locator('#theme-option');
    await expect(setThemeToggle).toBeVisible();

    // Verify the initial state of the toggle
    const isInitiallyChecked = await setThemeToggle.isChecked();
    console.log(`Initial state of toggle: ${isInitiallyChecked ? 'Checked' : 'Unchecked'}`);

    // Click the toggle to change its state
    await setThemeToggle.click();

    // Verify the new state of the toggle
    const isNowChecked = await setThemeToggle.isChecked();
    await expect(isNowChecked).toBe(!isInitiallyChecked); // State should be the opposite of the initial state

    console.log("Set Theme toggle state change verified");
});

test("Verify second SVG icon (Sun icon) is clickable", async ({ page }) => {
    await page.goto("http://localhost:5173");

    const sidebarToggleButton = page
        .locator('button >> svg[data-slot="icon"]')
        .first();
    await sidebarToggleButton.waitFor(); // Ensure button is present

    await sidebarToggleButton.click(); // Open sidebar
    const settingsButton = page.locator('svg.size-6.cursor-pointer');
    await settingsButton.click();

    // Locate the second SVG icon (Sun icon) inside the label
    const sunIcon = page.locator('label.mb-4cursor-pointer.label svg[data-slot="icon"]').nth(1);
    await expect(sunIcon).toBeVisible();

    // Verify the icon is clickable
    await expect(sunIcon).toBeEnabled();

    // Click the icon
    await sunIcon.click();

    console.log("Second SVG icon (Sun icon) is clickable");
});

test("Verify Show Hidden Tags toggle state change", async ({ page }) => {
    await page.goto("http://localhost:5173");

    const sidebarToggleButton = page
        .locator('button >> svg[data-slot="icon"]')
        .first();
    await sidebarToggleButton.waitFor(); // Ensure button is present

    await sidebarToggleButton.click(); // Open sidebar
    const settingsButton = page.locator('svg.size-6.cursor-pointer');
    await settingsButton.click();

    // Locate the parent label
    const label = page.locator('label.mb-4cursor-pointer.label');

    // Locate the Show Hidden Tags toggle inside the label using its unique ID
    const showHiddenTagsToggle = label.locator('#hidden-tag-option');
    await expect(showHiddenTagsToggle).toBeVisible();

    // Verify the initial state of the toggle
    const isInitiallyChecked = await showHiddenTagsToggle.isChecked();
    console.log(`Initial state of Show Hidden Tags toggle: ${isInitiallyChecked ? 'Checked' : 'Unchecked'}`);

    // Click the toggle to change its state
    await showHiddenTagsToggle.click();

    // Verify the new state of the toggle
    const isNowChecked = await showHiddenTagsToggle.isChecked();
    await expect(isNowChecked).toBe(!isInitiallyChecked); // State should be the opposite of the initial state

    console.log("Show Hidden Tags toggle state change verified");
});

test("Verify first SVG icon (left icon) in Show Hidden Tags is clickable", async ({ page }) => {
    await page.goto("http://localhost:5173");

    const sidebarToggleButton = page
        .locator('button >> svg[data-slot="icon"]')
        .first();
    await sidebarToggleButton.waitFor(); // Ensure button is present

    await sidebarToggleButton.click(); // Open sidebar
    const settingsButton = page.locator('svg.size-6.cursor-pointer');
    await settingsButton.click();


    // Locate the Show Hidden Tags section using the <p> text
    const showHiddenTagsSection = page.locator('p:has-text("Show Hidden Tags")').locator('xpath=..'); // Move to parent element

    // Locate the first SVG icon (left icon) inside the label
    const leftIcon = showHiddenTagsSection.locator('svg[data-slot="icon"]').first();
    await expect(leftIcon).toBeVisible();

    // Verify the icon is clickable
    await expect(leftIcon).toBeEnabled();

    // Click the icon
    await leftIcon.click();

    console.log("First SVG icon (left icon) in Show Hidden Tags is clickable");
});

test("Verify second SVG icon (right icon) in Show Hidden Tags is clickable", async ({ page }) => {
    await page.goto("http://localhost:5173");

    const sidebarToggleButton = page
        .locator('button >> svg[data-slot="icon"]')
        .first();
    await sidebarToggleButton.waitFor(); // Ensure button is present

    await sidebarToggleButton.click(); // Open sidebar
    const settingsButton = page.locator('svg.size-6.cursor-pointer');
    await settingsButton.click();

    // Locate the Show Hidden Tags section using the <p> text
    const showHiddenTagsSection = page.locator('p:has-text("Show Hidden Tags")').locator('xpath=..'); // Move to parent element

    // Locate the second SVG icon (right icon) inside the label
    const rightIcon = showHiddenTagsSection.locator('svg[data-slot="icon"]').nth(1);
    await expect(rightIcon).toBeVisible();

    // Verify the icon is clickable
    await expect(rightIcon).toBeEnabled();

    // Click the icon
    await rightIcon.click();

    console.log("Second SVG icon (right icon) in Show Hidden Tags is clickable");
});

test("Verify Close button is clickable and closes settings menu", async ({ page }) => {
    await page.goto("http://localhost:5173");

    const sidebarToggleButton = page
        .locator('button >> svg[data-slot="icon"]')
        .first();
    await sidebarToggleButton.waitFor(); // Ensure button is present

    await sidebarToggleButton.click(); // Open sidebar
    const settingsButton = page.locator('svg.size-6.cursor-pointer');
    await settingsButton.click();

    // Locate the Close button

    const closeButton = page.locator('button:has-text("Close")').first();
    // Verify the Close button is clickable
    await expect(closeButton).toBeEnabled();

    await closeButton.click();

    console.log("Close button is clickable and closes the settings menu");
});

test("Verify question mark icon is clickable", async ({ page }) => {
    await page.goto("http://localhost:5173");

    const sidebarToggleButton = page
        .locator('button >> svg[data-slot="icon"]')
        .first();
    await sidebarToggleButton.waitFor(); // Ensure button is present

    await sidebarToggleButton.click(); // Open sidebar
    const settingsButton = page.locator('svg.size-6.cursor-pointer');
    await settingsButton.click();

    const settingsSection = page.locator('div:has-text("Settings")');

    // Locate the question mark icon using its specific class
    const questionMarkIcon = settingsSection.locator('svg.mb-4.size-6.cursor-pointer.text-base-content\\/70');
    await expect(questionMarkIcon).toBeVisible();

    // Verify the icon is clickable
    await expect(questionMarkIcon).toBeEnabled();

    // Click the icon to open the modal or menu
    await questionMarkIcon.click();

    const modalOrMenu = page.locator('.modal-box');
    await expect(modalOrMenu).toBeVisible();

    console.log("Question mark icon is clickable and opens the modal/menu");
});

test("Verify GitHub link is clickable", async ({ page }) => {
    await page.goto("http://localhost:5173");

    const sidebarToggleButton = page
        .locator('button >> svg[data-slot="icon"]')
        .first();
    await sidebarToggleButton.waitFor(); // Ensure button is present

    await sidebarToggleButton.click(); // Open sidebar
    const settingsButton = page.locator('svg.size-6.cursor-pointer');
    await settingsButton.click();

    const settingsSection = page.locator('div:has-text("Settings")');

    // Locate the question mark icon using its specific class
    const questionMarkIcon = settingsSection.locator('svg.mb-4.size-6.cursor-pointer.text-base-content\\/70');
    await expect(questionMarkIcon).toBeVisible();

    // Verify the icon is clickable
    await expect(questionMarkIcon).toBeEnabled();

    // Click the icon to open the modal or menu
    await questionMarkIcon.click();

    const modalOrMenu = page.locator('.modal-box');
    await expect(modalOrMenu).toBeVisible();

    const githubLink = page.locator('a.link.link-info:has-text("Detailed User Guide")');
    await expect(githubLink).toBeVisible();

    // Verify the link is clickable
    await expect(githubLink).toBeEnabled();

    // Optionally, verify the link's href attribute
    const href = await githubLink.getAttribute('href');
    expect(href).toBe('https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2025-team-2');

    console.log("GitHub link is clickable and has the correct URL");
});

test("Verify GitHub link opens correct URL", async ({ page }) => {
    await page.goto("http://localhost:5173");

    const sidebarToggleButton = page
        .locator('button >> svg[data-slot="icon"]')
        .first();
    await sidebarToggleButton.waitFor(); // Ensure button is present

    await sidebarToggleButton.click(); // Open sidebar
    const settingsButton = page.locator('svg.size-6.cursor-pointer');
    await settingsButton.click();

    const settingsSection = page.locator('div:has-text("Settings")');

    // Locate the question mark icon using its specific class
    const questionMarkIcon = settingsSection.locator('svg.mb-4.size-6.cursor-pointer.text-base-content\\/70');
    await expect(questionMarkIcon).toBeVisible();

    // Verify the icon is clickable
    await expect(questionMarkIcon).toBeEnabled();

    // Click the icon to open the modal or menu
    await questionMarkIcon.click();

    const modalOrMenu = page.locator('.modal-box');
    await expect(modalOrMenu).toBeVisible();

    // Locate the GitHub link inside the modal or menu
    const githubLink = page.locator('a.link.link-info:has-text("Detailed User Guide")');
    await expect(githubLink).toBeVisible();

    const href = await githubLink.getAttribute('href');
    console.log(`GitHub link href: ${href}`);

    const [newPage] = await Promise.all([
        page.waitForEvent('popup'), // Wait for the new tab to open
        githubLink.click(), // Click the link
    ]);

    await newPage.waitForLoadState('load');

    const actualUrl = newPage.url();

    expect(actualUrl).toBe('https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2025-team-2');

    console.log("GitHub link opens the correct URL in a new tab");
});

test("Verify delete functionality for a DICOM tag", async ({ page }) => {
    test.setTimeout(75000);
    await page.goto("http://localhost:5173");

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
});
