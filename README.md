# DICOM File Tag Editor

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1jIk5wzWlDpzqyio9LwB-J7vy9-hjx8zN" />
</p>

## Overview

This project is a simple DICOM file tag editor that allows users to view and
modify the metadata tags of DICOM files directly in the browser. DICOM (Digital
Imaging and Communications in Medicine) files are commonly used in medical
imaging systems, and this tool aims to provide a lightweight and user-friendly
interface for interacting with these files' metadata.

The editor allows users to upload a DICOM file, view its tags (such as Patient
Name, Study Date, etc.), and modify the tag values. This application runs
entirely in the browser, using **React**, **Vite**, **TailwindCSS**, and
**DaisyUI** for a modern and responsive user interface.

[GitHub Pages](https://universityofsaskatchewancmpt371.github.io/term-project-2025-team-2/)

## Features

- Upload a DICOM file to extract metadata.
- View and edit DICOM file tags.
- Save the modified tag values
- A clean and simple UI for easier navigation.
- PWA (Progressive Web App) support for offline use.

## Technologies Used

- **React**: JavaScript library for building user interfaces.
- **Vite**: A modern, fast build tool for React that offers fast hot module
  replacement (HMR) and optimal production builds.
- **TailwindCSS**: Utility-first CSS framework for styling the app with ease and
  flexibility.
- **DaisyUI**: A TailwindCSS component library to speed up UI development with
  pre-designed components.
- **TypeScript**: Used for handling file uploads, parsing DICOM tags, and
  enabling tag editing functionality.
- **dicomParser.js**: A library used to parse DICOM files and extract metadata
  tags.
- **PWAs (Progressive Web Apps)**: Enabling offline use and improved
  performance.
- **Jest**: JavaScript/Typescript testing framework, works well with React. Used
  here for unit/integration type testing.
- **Playwright**: End-to-End functional UI testing framework, automates browser
  interactions.

## Installation

### Prerequisites

No installation is required for this application, as it runs entirely in your
web browser. You only need a modern web browser (such as Chrome, Firefox, or
Edge) to use the editor.

### Steps to Run Locally

1. Clone this repository:
    ```bash
    git clone https://github.com/yourusername/dicom-tag-editor.git
    ```
2. Navigate into the project directory:
    ```bash
    cd dicom-tag-editor
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Run the development server:
    ```bash
    npm run dev
    ```
5. Open your browser and go to `http://localhost:5173` to start using the DICOM
   tag editor.

### For testers

Once test files are made in your branch:

1. Install the dependencies:
    ```bash
    npm install
    ```
2. Run all tests:
    ```bash
    npm test
    ```

### Docker Container

A Docker container is provided with nginx used to serve the application.

A development Docker container is also provided with Vite's development server
running.

## Usage

1. **Upload a DICOM file**: Click the "Upload" button to select a DICOM file
   from your computer.
2. **View tags**: Once the file is uploaded, the tags from the DICOM file will
   be listed.
3. **Edit tags**: Modify the value of any editable tags in the provided input
   fields.
4. **Automatically remove PII (not implemented)**: Optionally, click the "Remove
   PII" button to automatically remove any personally identifiable information
   (PII) from the DICOM file.
5. **Save changes**: While the current version only allows you to edit and
   display tags, saving and updating the file’s actual metadata will be possible
   in future releases.
6. **Download updated DICOM file**: Click the "Save Files" button to save the
   updated DICOM file with the new metadata.

## Example Workflow

1. Click on the "Choose File" button to select a DICOM file or drag and drop the
   file onto the page.
2. The DICOM file's tags will automatically be displayed on the page.
3. Modify the tags by typing into the input fields next to each tag.
4. The page will display the updated tags in real-time.
5. Save the modified metadata to a new DICOM file.
6. Download the updated DICOM file with the new metadata.
7. Option to automatically remove any personally identifiable information (PII)
   from the DICOM file.

## License

This project is licensed under MIT License.

## Acknowledgements

University of Saskatchewan CMPT 371 - Software Engineering Project, 2025 Winter
Term - Team 2
