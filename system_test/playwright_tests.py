from playwright.sync_api import sync_playwright

import os
import json

TEST_FILES_DIR = os.getcwd() + '/test_files'

# # Colors for terminal output
OK_GREEN = '\033[92m'
WARNING = '\033[93m'
FAIL = '\033[91m'
END = '\033[0m'


def runAllTests():

    failed_tests = 0

    with sync_playwright() as p:
        for browser_type in [p.chromium, p.firefox, p.webkit]:

            print(f'\n{WARNING}Running tests for {browser_type.name} -------------------{END}')
            failed_tests += runTest(browser_type)
            print(f'{OK_GREEN}Tests for {browser_type.name} finished -------------------{END}')

    return failed_tests


def runTest(browser_type, failed_tests=0):
        
    browser = browser_type.launch()
    page = browser.new_page()
    page.goto('http://web:80')


    files_list = os.listdir(TEST_FILES_DIR)
    tags_files = [f for f in files_list if f.endswith(".json")]
    dicom_files = [f for f in files_list if f.endswith(".dcm")]

    for file in dicom_files:

        page.goto('http://web:80') # refresh page between files

        find_tag_file = f'tags_{file.split(".")[0]}.json'

        if find_tag_file not in tags_files:
            print(f"\n{FAIL}Tags file not found for {file}, skipping{END}\n")
            continue
        
        print(f'\nDicom file: {file}')
        print(f'Tags file: {find_tag_file}')

        with open(f'{TEST_FILES_DIR}/{find_tag_file}') as opened_file:
            file_IM_tags = json.load(opened_file)
        
        page.set_input_files('input#file-input', files=[f'{TEST_FILES_DIR}/{file}'])
        page.locator('input#file-input').set_input_files(files=[f'{TEST_FILES_DIR}/{file}'])
        
        page.wait_for_timeout(3000)
        
        rows = page.locator('tbody#tags-body').locator('tr').all()

        print(f'rows found: {len(rows)}')
        print(f'rows expected: {len(file_IM_tags)}')

        try:
            assert len(rows) == len(file_IM_tags)
        except AssertionError:
            failed_tests += 1
            print(f'{FAIL}Number of rows in table does not match number of tags in file{END}')
            continue

        for i, r in enumerate(rows):
            col = r.locator('td').all()

            value = col[2].locator("input").input_value()

            # print(f'{col[0].inner_text()}, {col[1].inner_text()}, {col[2].locator("input").input_value()}')
            try:
                assert file_IM_tags[i]["tag"] in col[0].inner_text()
            except AssertionError:
                failed_tests += 1
                print(f'{FAIL}Tag does not match{END}')
                print(f'Expected: {file_IM_tags[i]["tag"]}')
                print(f'Actual: {col[0].inner_text()}')
                continue

            try:
                assert file_IM_tags[i]["name"] in col[1].inner_text()
            except AssertionError:
                failed_tests += 1
                print(f'\t{FAIL}Name does not match{END}')
                print(f'\tExpected: {file_IM_tags[i]["name"]}')
                print(f'\tActual: {col[1].inner_text()}')
                continue

            # handle strange characters, messes up assert, add any other special characters to skip checking specific values
            if "@" not in value:
                try:
                    assert file_IM_tags[i]["value"] in value
                except AssertionError:
                    failed_tests += 1
                    print(f'{FAIL}Value does not match{END}')
                    print(f'Expected: {file_IM_tags[i]["value"]}')
                    print(f'Actual: {value}')
                    continue

    return failed_tests
    


if __name__ == "__main__":

    print("Running tests")

    failed_tests = runAllTests();      

    if failed_tests > 0:
        print(f'{FAIL}Tests failed: {failed_tests}{END}')
        print(f'{FAIL}Tests finished -------------------{END}')
    else:
        print(f'{OK_GREEN}Tests finished-------------------{END}')      

 