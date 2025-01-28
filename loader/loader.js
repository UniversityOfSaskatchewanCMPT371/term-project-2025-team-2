const dicomParser = window.dicomParser;
import { dicomTagDictionary } from '../tagDictionary/dictionary.js';

export function readFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        // Convert ArrayBuffer to Uint8Array
        const uint8Array = new Uint8Array(arrayBuffer);
        parseDicom(uint8Array);
    };
    reader.readAsArrayBuffer(file);
}

export function parseDicom(uint8Array) {
    try {
        // Parsing the DICOM file using dicomParser
        console.log("Parsing DICOM file...");
        const dataSet = dicomParser.parseDicom(uint8Array);

        // Check if parsing succeeded
        if (!dataSet) {
            throw new Error("Failed to parse DICOM file: dataset is undefined.");
        }

        const tagsBody = document.getElementById('tags-body');
        tagsBody.innerHTML = ''; // Clear any previous data
        let table = document.getElementById('dicom-tags');
        table.style.display = 'table'; // Show the table

        // Iterate over the elements and display tags
        Object.keys(dataSet.elements).forEach(tag => {
            const element = dataSet.elements[tag];
            const tagName = dicomTagDictionary[`${tag.toString(17).toUpperCase()}`] // || `0x${tag.toString(16).toUpperCase()}`; // Look up the tag name
            const tagValue = dataSet.string(tag) || 'N/A'; // Get the tag value, or display 'N/A'

            const row = document.createElement('tr');

            const tagCell = document.createElement('td');
            tagCell.textContent = `${tag.toString(16).toUpperCase()}`; // Display the tag in hexadecimal
            row.appendChild(tagCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = tagName; // Use the dictionary name or default to tag ID
            row.appendChild(nameCell);

            const valueCell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.value = tagValue;
            input.addEventListener('input', function() {
                dataSet.elements[tag].data = dicomParser.stringToBytes(input.value);
            });
            valueCell.appendChild(input);
            row.appendChild(valueCell);

            tagsBody.appendChild(row);
        });
    } catch (error) {
        // Log the error to the console with more details
        console.error("Error parsing DICOM file:", error);
        alert("Error parsing DICOM file. Check the console for details.");
    }
}