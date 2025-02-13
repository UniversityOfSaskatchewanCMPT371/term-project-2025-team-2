import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { parseDicomFile } from "../DicomData/DicomParserUtils.tsx";
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
            console.log(files); // here just to use the files variable
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
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
    });

    return (
        <div>
            <div
                {...getRootProps()}
                className={`relative h-64 w-full cursor-pointer rounded-xl border-2 border-solid ${
                    isDragActive ? 'border-primary bg-primary/5' : 'border-blue-800 [data-theme="night"]:bg-blue-950/30 [data-theme="corporate"]:bg-base-200'
                }`}
            >
                <input {...getInputProps()} />
                <p className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 transform text-center text-base-content">
                    Drag and drop DICOM files here, or click the button below to select files
                </p>

                <button
                    onClick={(e) => e.preventDefault()}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-xl bg-primary text-white px-8 py-2 text-lg transition duration-300 ease-in-out hover:bg-secondary hover:scale-110 disabled:bg-gray-400"

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
