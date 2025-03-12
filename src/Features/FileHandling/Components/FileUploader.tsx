import React from "react";
import { useDropzone } from "react-dropzone";
import { parseDicomFile } from "../../../DataFunctions/DicomData/DicomParserUtils.ts";
import { FileUploaderProps } from "../Types/FileTypes";
import logger from "../../../Logger/Logger.ts";
import { useStore } from "@state/Store.tsx";

/**
 * FileUploader component
 * @component
 * @description - Component for uploading files
 * @precondition - FileUploader component expects the following props
 * @precondition - onFileUpload - Function to handle file upload
 * @param onFileUpload - Function to handle file upload
 * @returns rendered FileUploader component
 */
export const FileUploader: React.FC<FileUploaderProps> = ({
    onFileUpload,
    loading,
    clearData,
    toggleModal,
}) => {
    const setFileParseError = useStore((state) => state.setFileParseErrorFileNames);
    const fileParseError = useStore((state) => state.fileParseErrorFileNames);
    /**
     *
     * @param e - Change event
     * Handles file change event
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles) {
            const fileArray = Array.from(selectedFiles);
            processFiles(fileArray);
        }
    };

    /**
     *
     * @param fileArray - Array of files
     * Processes files
     */
    const processFiles = (fileArray: File[]) => {
        clearData();
        loading(true);

        // Map each file to a Promise that resolves with its parsed data
        const promises = fileArray.map((file) =>
            parseDicomFile(file).catch((error) => {
                // If any file fails, clear everything and trigger modal
                setFileParseError([...fileParseError, file.name]);
                logger.error(error);
                toggleModal();
                return null; // Ensure failed files do not break Promise.all
            })
        );

        // Wait for all Promises to resolve
        Promise.all(promises)
            .then((dicomDataArray) => {
                // Check if all files succeeded (no `null` values)
                if (dicomDataArray.every((data) => data !== null)) {
                    onFileUpload(fileArray, dicomDataArray); // Ensures correct order
                } else {
                    onFileUpload(
                        [],
                        dicomDataArray.filter((data) => data !== null)
                    );
                }
            })
            .finally(() => {
                loading(false);
            });
    };

    /**
     *
     * @param acceptedFiles - Array of accepted files
     * Handles file drop event
     */
    const onDrop = (acceptedFiles: File[]) => {
        clearData();
        loading(true);
        processFiles(acceptedFiles);
    };

    /**
     * dropzone hook
     */
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: true,
    });

    return (
        <div>
            <div
                {...getRootProps()}
                className={`relative min-h-[200px] cursor-pointer rounded-lg border-2 border-dashed border-secondary px-5 py-10 text-center`}
            >
                <input {...getInputProps()} />
                <p className="text-base-content">
                    Drag and drop DICOM files here, or click the button below to
                    select files
                </p>

                <button
                    onClick={(e) => e.preventDefault()}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-primary px-7 py-3 text-lg text-white transition duration-300 ease-in-out hover:scale-110 hover:bg-secondary disabled:bg-gray-400"
                >
                    Select Files
                </button>
            </div>
            <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
};
