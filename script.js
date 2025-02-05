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

    let files = []
    let index = 0

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

        files = event.dataTransfer.files

        if(files.length > 1) {
            document.getElementById("next").style.display = "block"
        }

        if (files.length > 0) {
            displayFileInfo(files[0]);

            displayFileTags(files[0]);
        }
    })

    // Handle file input change
    fileInput.addEventListener("change", (event) => {
        files = event.target.files

        if(files.length > 1) {
            document.getElementById("file-buttons").style.display = "block"
            document.getElementById("next").style.visibility = "visible"
        }

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

    function next() {
        index++

        if(index >= 1){
            document.getElementById("previous").style.visibility = "visible"
        }

        if (index >= files.length) {
            document.getElementById("next").style.visibility = "hidden"
            return
        }

        displayFileInfo(files[index])
        displayFileTags(files[index])

    }

    function previous() {
        index--

        if(index <= 0){
            document.getElementById("previous").style.visibility = "hidden"
        } else if(index < files.length){
            document.getElementById("next").style.visibility = "visible"
        }

        if (index < 0) {
            return
        }

        displayFileInfo(files[index])
        displayFileTags(files[index])
    }

    function filterTable() {
        let input = document.getElementById('filterInput');
        let filter = input.value.toUpperCase();
        let table = document.getElementById("tags-body");
        let rows = table.getElementsByTagName("tr");

        for (let i = 0; i < rows.length; i++) {
          let cells = rows[i].getElementsByTagName("td");
          let found = false;

          for (let j = 0; j < cells.length; j++) {
            if (cells[j].innerText.toUpperCase().includes(filter)) {
              found = true;
              break;
            }
          }

          if (found) {
            rows[i].style.display = "";
          } else {
            rows[i].style.display = "none";
          }
        }
      }

    document.getElementById("filterInput").addEventListener("keyup", filterTable)

    document.getElementById("next").addEventListener("click", () => {
        next()
    })

    document.getElementById("previous").addEventListener("click", () => {
        previous()
    })
}

if (typeof document != "undefined") {
    document
        .getElementById("sidebarCollapse")
        .addEventListener("click", toggleSidebar)

    document.addEventListener("DOMContentLoaded", () => {
        setupFileUpload()
    })

    document.getElementById("log-file-save").addEventListener("click", () => {
        let logData = logger.getLog()

        const blob = new Blob([logData], { type: 'application/json' });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'log_' + new Date().toISOString() + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    })

    document.getElementById("log-verbose").addEventListener("click", () => {
        logger.toggleVerbose()
        if(logger.verbose){
            document.getElementById("log-verbose").style.color = "green"
        } else {
            document.getElementById("log-verbose").style.color = "red"
        }
    })

    document.getElementById("update-dicom-tags").addEventListener("click", () => {
        loadTags.downloadModifiedDicom()
    })


}
