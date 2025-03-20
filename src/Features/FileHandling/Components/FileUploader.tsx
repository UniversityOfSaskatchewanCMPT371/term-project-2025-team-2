import React, { useRef } from "react";
import { useDropzone } from "react-dropzone";
import { parseDicomFile } from "@dataFunctions/DicomData/DicomParserUtils";
import { FileUploaderProps } from "../Types/FileTypes";
import logger from "@logger/Logger";
import { useStore } from "@state/Store";

import { FolderIcon, Square2StackIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "react-tooltip";

interface DirectoryInputHTMLAttributes
    extends React.InputHTMLAttributes<HTMLInputElement> {
    webkitdirectory?: string;
    directory?: string;
    mozdirectory?: string;
}

/**
 * FileUploader component
 * @component
 * @description - Component for uploading files and directories while maintaining structure
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
    const setFileParseError = useStore(
        (state) => state.setFileParseErrorFileNames
    );
    const fileParseError = useStore((state) => state.fileParseErrorFileNames);
    const setFileStructure = useStore((state) => state.setFileStructure);
    const setLoadingMsg = useStore((state) => state.setLoadingMsg);

    const setAlertMsg = useStore((state) => state.setAlertMsg);
    const setAlertType = useStore((state) => state.setAlertType);
    const setShowAlert = useStore((state) => state.setShowAlert);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const directoryInputRef = useRef<HTMLInputElement>(null);

    let currentFile = 0;

    /**
     * Handles file change event from file input elements
     * @description - Processes files selected via the file input elements
     * @param e - Change event from file input
     * @precondition - File input element must have files selected
     * @postcondition - Files are processed or an error alert is shown
     * @returns void
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;

        if (selectedFiles && selectedFiles.length > 0) {
            setLoadingMsg(
                `Processing file ${currentFile} of ${selectedFiles.length} files...`
            );
            const fileArray = Array.from(selectedFiles);
            processFiles(fileArray);
        } else {
            loading(false);
            setAlertType("alert-error");
            setAlertMsg("No files selected or permission denied.");
            setShowAlert(true);
        }
    };

    /**
     * Processes array of files while preserving folder structure
     * @description - Parses DICOM files and maintains folder structure information
     * @param fileArray - Array of File objects to process
     * @param existingFileStructure - Optional existing file structure to use
     * @precondition - fileArray must contain valid File objects
     * @postcondition - Files are parsed, structure is saved, and results are passed to onFileUpload
     * @returns void
     */
    const processFiles = (
        fileArray: File[],
        existingFileStructure?: Record<string, File[]>
    ) => {
        clearData();
        loading(true);

        logger.info(`Processing ${fileArray.length} files`);
        fileArray.sort((a, b) => {
            const pathA = (a as any).webkitRelativePath || a.name;
            const pathB = (b as any).webkitRelativePath || b.name;
            return pathA.localeCompare(pathB, undefined, { numeric: true, sensitivity: "base" });
        });

        const fileStructureTemp: Record<string, File[]> =
            existingFileStructure || {};

        if (!existingFileStructure) {
            fileArray.forEach((file) => {
                const path = (file as any).webkitRelativePath || "";
                const directory = path.split("/").slice(0, -1).join("/");
                const dir = directory || "root";

                if (!fileStructureTemp[dir]) {
                    fileStructureTemp[dir] = [];
                }

                fileStructureTemp[dir].push(file);
            });

            logger.debug("Folder structure preserved from input selection");
        } else {
            logger.debug("Using provided folder structure");
        }

        setFileStructure(fileStructureTemp);

        const promises = fileArray.map((file) =>
            parseDicomFile(file)
                .then((data) => {
                    currentFile++;
                    setLoadingMsg(
                        `Processing file ${currentFile} of ${fileArray.length} files...`
                    );

                    const path = (file as any).webkitRelativePath || file.name;

                    return {
                        ...data,
                        filePath: path,
                        fileName: file.name,
                    };
                })
                .catch((error) => {
                    logger.error(`Error parsing file: ${file.name}`);
                    setFileParseError([...fileParseError, file.name]);
                    logger.error(error);
                    toggleModal();
                    return null;
                })
        );

        Promise.all(promises)
            .then((dicomDataArray) => {
                const validData = dicomDataArray.filter(
                    (data) => data !== null
                );
                if (dicomDataArray.every((data) => data !== null)) {
                    onFileUpload(fileArray, validData);
                } else {
                    onFileUpload(
                        fileArray.filter((_, i) => dicomDataArray[i] !== null),
                        validData
                    );
                }
            })
            .finally(() => {
                loading(false);
                setLoadingMsg("");
            });
    };

    /**
     * Handles files dropped into the dropzone
     * @description - Processes files dropped by the user into the dropzone
     * @param acceptedFiles - Array of files accepted by the dropzone
     * @precondition - Files must be dropped into the dropzone area
     * @postcondition - Files are cleared and processed
     * @returns void
     */
    const onDrop = async (acceptedFiles: File[]) => {
        logger.info(`Accepted ${acceptedFiles.length} files`);
        clearData();
        loading(true);
        currentFile = 0;

        try {
            await processEntries(acceptedFiles);
        } catch (error) {
            logger.error("Error processing dragged folder structure:", error);
            processFiles(acceptedFiles);
        }
    };

    /**
     * Process entries from drag and drop operation
     * @description - Process files from drag and drop operation, placing all in a single folder
     * @param files - Files from drag and drop
     * @returns A promise that resolves when all entries are processed
     */
    const processEntries = async (files: File[]) => {
        const fileStructureTemp: Record<string, File[]> = {
            root: [...files],
        };

        logger.debug(
            "Drag and drop detected - placing all files in root folder"
        );
        logger.debug(`Total files: ${files.length}`);

        files.forEach((file, index) => {
            Object.defineProperty(file, "webkitRelativePath", {
                value: `root/${file.name}`,
                writable: true,
            });

            if (index < 3) {
                logger.debug(
                    `Sample file ${index}: ${file.name}, size: ${file.size}`
                );
            }
        });

        processFiles(files, fileStructureTemp);
    };

    /**
     * Opens the native file selector dialog
     * @description - Opens either file or directory selector based on parameter
     * @param isDirectory - Boolean indicating if directory selector should be opened
     * @precondition - Browser must support file/directory selection
     * @postcondition - File selector dialog opens for user interaction
     * @returns void
     */
    const openFileSelector = (isDirectory: boolean) => {
        try {
            if (isDirectory && directoryInputRef.current) {
                if ("webkitdirectory" in HTMLInputElement.prototype) {
                    directoryInputRef.current.click();
                } else {
                    alert(
                        "Your browser doesn't support folder uploads. Please use Chrome or Edge for this feature."
                    );
                }
            } else if (!isDirectory && fileInputRef.current) {
                fileInputRef.current.click();
            }
        } catch (error) {
            logger.error("Error opening file selector:", error);
            alert(
                "There was an error accessing the file system. Please try again."
            );
        }
    };

    /**
     * Sets up the react-dropzone hook
     * @description - Configures the dropzone for file uploads
     * @precondition - None
     * @postcondition - Dropzone is configured with the proper handlers
     * @returns Dropzone props and handlers
     */
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: true,
        noClick: true,
        noKeyboard: true,
    });

    return (
        <div>
            <div
                {...getRootProps()}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        openFileSelector(false);
                    }
                }}
                className={`relative min-h-[200px] cursor-pointer rounded-lg border-2 border-dashed border-secondary px-5 py-10 text-center`}
            >
                <input {...getInputProps()} />
                <p className="text-base-content">
                    Drag and drop DICOM files or folders here, or click the
                    buttons below to select
                </p>

                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center gap-3">
                    <div className="flex flex-col gap-6 sm:flex-row">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                openFileSelector(false);
                            }}
                            className="rounded-full bg-primary px-5 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-secondary disabled:bg-gray-400"
                        >
                            <div
                                className="fel-col-2 flex"
                                data-testid="edit-tag-button"
                                data-tooltip-id="select-files-button-tooltip"
                                data-tooltip-content="Upload File/s"
                                data-tooltip-place="top"
                            >
                                Select Files
                                <Square2StackIcon className="ml-4 h-6 w-6" />
                            </div>
                            <Tooltip id="select-files-button-tooltip" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                openFileSelector(true);
                            }}
                            className="rounded-full bg-primary px-5 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-secondary disabled:bg-gray-400"
                        >
                            <div
                                className="fel-col-2 flex"
                                data-testid="edit-tag-button"
                                data-tooltip-id="select-folder-button-tooltip"
                                data-tooltip-content="Upload Folder/s"
                                data-tooltip-place="top"
                            >
                                Select Folder
                                <FolderIcon className="ml-4 h-6 w-6" />
                            </div>
                            <Tooltip id="select-folder-button-tooltip" />
                        </button>
                    </div>
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
            />

            <input
                ref={directoryInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                {...({
                    webkitdirectory: "",
                    directory: "",
                    mozdirectory: "",
                } as DirectoryInputHTMLAttributes)}
            />
        </div>
    );
};
