import { Logger } from "./logger/logger.js"
import { LoadTags } from "./loader/loader.js"

export const logger = new Logger()
export const loadTags = new LoadTags()


function toggleSidebar() {
    const sidebar = document.getElementById("sidebar")
    if (sidebar.style.right === "0px") {
        sidebar.style.right = "-250px" // Close sidebar
    } else {
        sidebar.style.right = "0px" // Open sidebar
    }
}

function setupFileUpload() {
    const dropArea = document.getElementById("drop-area")
    const fileInput = document.getElementById("file-input")
    const fileInfo = document.getElementById("file-info")
    const openFileBtn = document.getElementById("open-file-btn")

    // Open file input dialog when button is clicked
    openFileBtn.addEventListener("click", () => {
        fileInput.click()
    })

    // Handle drag events
    dropArea.addEventListener("dragover", (event) => {
        event.preventDefault()
        dropArea.classList.add("hover")
    })

    dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("hover")
    })

    dropArea.addEventListener("drop", (event) => {
        event.preventDefault()
        dropArea.classList.remove("hover")

        const files = event.dataTransfer.files
        if (files.length > 0) {
            displayFileInfo(files[0]);

            displayFileTags(files[0]);
        }
    })

    // Handle file input change
    fileInput.addEventListener("change", (event) => {
        const files = event.target.files
        if (files.length > 0) {
            displayFileInfo(files[0])

            displayFileTags(files[0]);

        }
    })

    function displayFileInfo(file) {
        fileInfo.textContent = `File selected: ${file.name}, Size: ${(file.size / 1024).toFixed(2)} KB`
        logger.log("INFO", fileInfo.textContent)
    }

    function displayFileTags(file) {

        const loading_text = document.getElementById("loading-text")
        loading_text.innerHTML = "Loading . . ."

        loadTags.readFile(file).then((table) => {
            const tagsBody = document.getElementById("tags-body")
            tagsBody.innerHTML = "" // Clear any previous data
            let tableDiv = document.getElementById("dicom-tags")
            tableDiv.style.display = "table" // Show the table
            loading_text.innerHTML = ""
            tagsBody.innerHTML = table

        })
    }
}

if (typeof document != "undefined") {
    document
        .getElementById("sidebarCollapse")
        .addEventListener("click", toggleSidebar)

    document.addEventListener("DOMContentLoaded", () => {
        setupFileUpload()
    })

    document.getElementById("log-file-picker").addEventListener("click", () => {
        logger.pickHandle()
    })
    document.getElementById("log-file-close").addEventListener("click", () => {
        logger.closeFile()
    })
}
