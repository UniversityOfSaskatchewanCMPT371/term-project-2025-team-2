import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { parseDicomFile } from "../DicomData/DicomParserUtils.tsx";
import { FileUploaderProps } from "../../types/FileTypes.ts";
import logger from "../utils/Logger.tsx";

/**
 *
 * @param onFileUpload - Function to handle file upload
 * @returns rendered FileUploader component
 */
const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, loading, clearData, toggleModal }) => {
    const [files, setFiles] = useState<File[]>([]);

    /**
     *
     * @param e - Change event
     * Handles file change event
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles) {
            logger.info(files); // here just to use the files variable
            const fileArray = Array.from(selectedFiles);
            setFiles(fileArray);
            processFiles(fileArray);
        }
    };

    /**
     *
     * @param fileArray - Array of files
     * Processes files
     */
    const processFiles = (fileArray: File[]) => {
        const dicomDataArray: any[] = [];

        fileArray.forEach((file) => {
            parseDicomFile(file)
                .then((dicomData) => {
                    dicomDataArray.push(dicomData);
                    if (dicomDataArray.length === fileArray.length) {
                        onFileUpload(fileArray, dicomDataArray);
                    }
                })
                .catch((error) => {
                    onFileUpload((fileArray = []), dicomDataArray);
                    toggleModal();
                    logger.error(error);
                });
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

        setFiles(acceptedFiles);
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
                className="relative min-h-[200px] cursor-pointer rounded-lg border-2 border-dashed border-secondary px-5 py-10 text-center"
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

export default FileUploader;
