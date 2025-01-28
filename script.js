import { logMessage } from './logger/logger.js';

// test fucntion to setup testing framework
function add(a, b) {
    return a + b;
}

// Added a comment to bypass the no-unused-vars for now
// eslint-disable-next-line no-unused-vars
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.style.right === "0px") {
        sidebar.style.right = "-250px"; // Close sidebar
    } else {
        sidebar.style.right = "0px"; // Open sidebar
    }
}


function setupFileUpload() {
    const dropArea = document.getElementById("drop-area");
    const fileInput = document.getElementById("file-input");
    const fileInfo = document.getElementById("file-info");
    const openFileBtn = document.getElementById("open-file-btn");

    // Open file input dialog when button is clicked
    openFileBtn.addEventListener("click", () => {
        fileInput.click();
    });

    // Handle drag events
    dropArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropArea.classList.add("hover");
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("hover");
    });

    dropArea.addEventListener("drop", (event) => {
        event.preventDefault();
        dropArea.classList.remove("hover");

        const files = event.dataTransfer.files;
        if (files.length > 0) {
            displayFileInfo(files[0]);
        }
    });

    // Handle file input change
    fileInput.addEventListener("change", (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            displayFileInfo(files[0]);
        }
    });

    function displayFileInfo(file) {
        fileInfo.textContent = `File selected: ${file.name}, Size: ${(file.size / 1024).toFixed(2)} KB`;
        logMessage("info", `File selected: ${file.name}, Size: ${(file.size / 1024).toFixed(2)} KB`);
    }
}


if (typeof document != 'undefined') {
    document.getElementById('sidebarCollapse').addEventListener('click', toggleSidebar);

    document.addEventListener("DOMContentLoaded", () => {
        setupFileUpload();
    });
}

export default { add };
