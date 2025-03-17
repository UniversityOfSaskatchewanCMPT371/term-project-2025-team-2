import React, { useRef} from "react";
import { useDropzone } from "react-dropzone";
import { parseDicomFile } from "@dataFunctions/DicomData/DicomParserUtils";
import { FileUploaderProps } from "../Types/FileTypes";
import logger from "@logger/Logger";
import { useStore } from "@state/Store";

// Add this at the top of your file, after your imports
interface DirectoryInputHTMLAttributes extends React.InputHTMLAttributes<HTMLInputElement> {
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
    const setFileStructure = useStore((state)=> state.setFileStructure);
    const setLoadingMsg = useStore((state)=> state.setLoadingMsg)
    
    const setAlertMsg = useStore((state)=> state.setAlertMsg)
    const setAlertType = useStore((state)=> state.setAlertType)
    const setShowAlert = useStore((state)=> state.setShowAlert)

    // Create refs for the file inputs
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
            setLoadingMsg(`Processing file ${currentFile} of ${selectedFiles.length} files...`);
            const fileArray = Array.from(selectedFiles);
            processFiles(fileArray);
        } else {
            loading(false);
            setAlertType("alert-error")
            setAlertMsg("No files selected or permission denied.");
            setShowAlert(true);
        }
    };

    /**
     * Processes array of files while preserving folder structure
     * @description - Parses DICOM files and maintains folder structure information
     * @param fileArray - Array of File objects to process
     * @precondition - fileArray must contain valid File objects
     * @postcondition - Files are parsed, structure is saved, and results are passed to onFileUpload
     * @returns void
     */
    const processFiles = (fileArray: File[]) => {
        clearData();
        loading(true);

        logger.info(`Processing ${fileArray.length} files`);
        
        // Store files by their path to maintain structure
        const fileStructureTemp: Record<string, File[]> = {};
        
        // Group files by directory
        fileArray.forEach(file => {
            // Get the file's relative path from webkitRelativePath
            
            const path = (file as any).webkitRelativePath || '';
            const directory = path.split('/').slice(0, -1).join('/');
            
            // If no directory info, place in root
            const dir = directory || 'root';
            
            // Initialize the directory array if it doesn't exist
            if (!fileStructureTemp[dir]) {
                fileStructureTemp[dir] = [];
            }
            
            // Add the file to its directory array
            fileStructureTemp[dir].push(file);
        });

        setFileStructure(fileStructureTemp)

        // Map each file to a Promise that resolves with its parsed data
        // and includes path information
        const promises = fileArray.map((file) =>
            parseDicomFile(file).then(data => {
                // Attach path information to the parsed data
               currentFile++;
                setLoadingMsg(`Processing file ${currentFile} of ${fileArray.length} files...`);

                const path = (file as any).webkitRelativePath || '';
                return {
                    ...data,
                    filePath: path,
                    fileName: file.name
                };
            }).catch((error) => {
                logger.error(`Error parsing file: ${file.name}`);
                setFileParseError([...fileParseError, file.name]);
                logger.error(error);
                toggleModal();
                return null; // Ensure failed files do not break Promise.all
            })
        );

        // Wait for all Promises to resolve
        Promise.all(promises)
            .then((dicomDataArray) => {
                // Filter out null values
                const validData = dicomDataArray.filter((data) => data !== null);
                // Check if all files succeeded (no `null` values)
                if (dicomDataArray.every((data) => data !== null)) {
                    onFileUpload(fileArray, validData)// fileStructure); // Pass file structure
                } else {
                    onFileUpload(
                        fileArray.filter((_, i) => dicomDataArray[i] !== null),
                        validData,
                        // fileStructure
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
    const onDrop = (acceptedFiles: File[]) => {
        logger.info(`Accepted ${acceptedFiles.length} files`);
        clearData();
        loading(true);
        processFiles(acceptedFiles);
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
                // For Chrome, you can also check if the feature is available
                if ('webkitdirectory' in HTMLInputElement.prototype) {
                    directoryInputRef.current.click();
                } else {
                    alert("Your browser doesn't support folder uploads. Please use Chrome or Edge for this feature.");
                }
            } else if (!isDirectory && fileInputRef.current) {
                fileInputRef.current.click();
            }
        } catch (error) {
            logger.error("Error opening file selector:", error);
            alert("There was an error accessing the file system. Please try again.");
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
        noClick: true, // Don't open file dialog on container click
        noKeyboard: true, // Disable keyboard navigation
    });

    return (
        <div>
            <div
                {...getRootProps()}
                onClick={(e) => {
                    // Only trigger if directly clicking the drop zone (not buttons)
                    if (e.target === e.currentTarget) {
                        openFileSelector(false);
                    }
                }}
                className={`relative min-h-[200px] cursor-pointer rounded-lg border-2 border-dashed border-secondary px-5 py-10 text-center`}
            >
                <input {...getInputProps()} />
                <p className="text-base-content">
                    Drag and drop DICOM files or folders here, or click the buttons below to select
                </p>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform flex flex-col items-center gap-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Add this to prevent event bubbling
                                e.preventDefault();
                                openFileSelector(false);
                            }}
                            className="rounded-full bg-primary px-5 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-secondary disabled:bg-gray-400"
                        >
                            Select Files
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Add this to prevent event bubbling
                                e.preventDefault();
                                openFileSelector(true);
                            }}
                            className="rounded-full bg-secondary px-5 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-primary disabled:bg-gray-400"
                        >
                            Select Folder
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Hidden file input for selecting individual files */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
            />
            
            {/* Hidden file input for selecting directories */}
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
