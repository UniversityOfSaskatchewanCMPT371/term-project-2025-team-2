import React from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useStore } from "../State/Store"; // Adjust import path based on your structure

const DownloadAllZip: React.FC = () => {
    const files = useStore((state) => state.files);

    const handleDownloadAllAsZip = async () => {
        if (files.length === 0) {
            alert("No files to download!");
            return;
        }

        const zip = new JSZip();
        files.forEach((file: File) => {
            zip.file(file.name, file);
        });

        try {
            const zipBlob = await zip.generateAsync({ type: "blob" });
            saveAs(zipBlob, "DICOM_Files.zip");
        } catch (error) {
            console.error("Error creating ZIP file:", error);
        }
    };

    return (
        <button
            onClick={handleDownloadAllAsZip}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
            Download All as ZIP
        </button>
    );
};

export default DownloadAllZip;
