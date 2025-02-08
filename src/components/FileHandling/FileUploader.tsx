import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { parseDicomFile } from "../DicomData/dicomParserUtils.tsx";
import Modal from "../utils/Modal.tsx";

/**
 * interface FileUploaderProps
 */
interface FileUploaderProps {
    onFileUpload: (files: File[], dicomData: any[]) => void;
}

/**
 *
 * @param onFileUpload - Function to handle file upload
 * @returns rendered FileUploader component
 */
const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
    const [files, setFiles] = useState<File[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    /**
     *
     * @param e - Change event
     * Handles file change event
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles) {
            console.log(files);
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
                    console.error(error);
                });
        });
    };

    /**
     *
     * @param acceptedFiles - Array of accepted files
     * Handles file drop event
     */
    const onDrop = (acceptedFiles: File[]) => {
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
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer rounded border-0 bg-secondary px-5 py-2 text-base-content hover:bg-accent"
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
            <Modal
                isOpen={isModalOpen}
                onClose={toggleModal}
                title="Error"
                text="File isn't a valid DICOM file."
            />
        </div>
    );
};

export default FileUploader;
