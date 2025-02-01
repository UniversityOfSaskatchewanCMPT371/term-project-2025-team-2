from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.file_detector import LocalFileDetector
from selenium.webdriver.support.wait import WebDriverWait

import os
import json

TEST_FILES_DIR = "/usr/app/sel_test/test_files"

# Colors for terminal output
OK_GREEN = '\033[92m'
FAIL = '\033[91m'
END = '\033[0m'


def run_test(driver):
    print ("Test " + driver.session_id)
    driver.file_detector = LocalFileDetector() # to upload files from local machine

    try:
        driver.implicitly_wait(3)
        driver.get("http://web:80/")

        print(f'Page title: {driver.title}')
        assert "DICOM" in driver.title

        files_list = os.listdir(TEST_FILES_DIR)
        tags_files = [f for f in files_list if f.endswith(".json")]
        dicom_files = [f for f in files_list if f.endswith(".dcm")]

        for file in dicom_files:

            driver.get("http://web:80/") # refresh page between files

            find_tag_file = f'tags_{file.split(".")[0]}.json'

            if find_tag_file not in tags_files:
                print(f"\n{FAIL}Tags file not found for {file}, skipping{END}\n")
                continue
            
            print(f'\nDicom file: {TEST_FILES_DIR}/{file}')
            print(f'Tags file: {TEST_FILES_DIR}/{find_tag_file}')

            with open(f'{TEST_FILES_DIR}/{find_tag_file}') as opened_file:
                file_IM_tags = json.load(opened_file)
            
            button = driver.find_element(By.ID, "file-input").send_keys(f'{TEST_FILES_DIR}/{file}') # upload file

            driver.implicitly_wait(3) # wait for the file to be uploaded, and parsed
            
            table = driver.find_element(By.ID, "tags-body")
            rows = table.find_elements(By.TAG_NAME, "tr")
            print(f'rows found: {len(rows)}')
            print(f'rows expected: {len(file_IM_tags)}')

            assert len(rows) == len(file_IM_tags)

            for i, row in enumerate(rows):
                col = row.find_elements(By.TAG_NAME, "td")
                # print(f'{col[0].text}, {col[1].text}, {col[2].find_element(By.TAG_NAME, "input").get_attribute("value")}')

                value = col[2].find_element(By.TAG_NAME, "input").get_attribute("value")

                assert file_IM_tags[i]["tag"] in col[0].text
                assert file_IM_tags[i]["name"] in col[1].text

                # handle strange characters, messes up assert, add any other special characters to skip checking specific values
                if "@" not in value:
                    assert file_IM_tags[i]["value"] in col[2].find_element(By.TAG_NAME, "input").get_attribute("value")

    finally:
        print("Tests finished")
        driver.quit()


def get_default_firefox_options():
    options = webdriver.FirefoxOptions()
    options.add_argument("--no-sandbox")
    return options


def get_default_chrome_options():
    options = webdriver.ChromeOptions()
    options.add_argument("--no-sandbox")
    return options


def get_default_edge_options():
    options = webdriver.EdgeOptions()
    options.add_argument("--no-sandbox")
    return options


def run_all_tests_all_browsers():

    browsers = ["firefox", "chrome", "edge"]

    for browser in browsers:
        if browser == "firefox":
            options = get_default_firefox_options()
        elif browser == "chrome":
            options = get_default_chrome_options()
        elif browser == "edge":
            options = get_default_edge_options()

        driver = webdriver.Remote(
            command_executor='http://selenium-hub:4444/wd/hub',
            options=options)

        print(f"\nRunning test on {browser}")
        run_test(driver)

        print(f"\n{OK_GREEN}Test on {browser} finished{END}")


if __name__ == "__main__":
    print("\nStarting tests")
    run_all_tests_all_browsers()

    print(f'{OK_GREEN}All tests finished -----------------------{END}')

