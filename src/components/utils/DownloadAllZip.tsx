import React from "react";
import { saveAs } from "file-saver";
import { useStore } from "../State/Store"; // Ensure correct import
import { createZipFromFiles } from "../DicomData/DownloadFuncs"; // Import the existing function
import { FileData } from "../../types/FileTypes"; // Ensure correct type import

const DownloadAllZip: React.FC = () => {
    const files = useStore((state) => state.files); // List of files
    const dicomData = useStore((state) => state.dicomData); // Corresponding file content

    const handleDownloadAllAsZip = async () => {
        if (!files || files.length === 0) {
            alert("No files to download!");
            return;
        }

        // Convert files to FileData format
        const fileDataArray: FileData[] = files.map((file, index) => ({
            name: file.name,
            content: ensureBlob(dicomData[index]), // Convert to Blob
        }));

        try {
            const zipBlob = await createZipFromFiles(fileDataArray);
            saveAs(zipBlob, "DICOM_Files_edited.zip");
        } catch (error) {
            console.error("Error downloading ZIP file:", error);
        }
    };

    return (
        <div>
            <button
                onClick={handleDownloadAllAsZip}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                disabled={files.length === 0}
            >
                Download All as ZIP
            </button>
        </div>
    );
};

// Helper function to ensure content is a Blob
const ensureBlob = (data: any): Blob => {
    if (data instanceof Blob) {
        return data;
    }
    if (Array.isArray(data) && data.every((item) => item instanceof Blob)) {
        return new Blob(data, { type: "application/dicom" });
    }
    console.warn("Invalid DICOM data type, defaulting to empty Blob");
    return new Blob([], { type: "application/dicom" });
};

export default DownloadAllZip;
