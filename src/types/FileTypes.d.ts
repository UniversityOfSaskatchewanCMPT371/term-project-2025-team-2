/**
 * interface FileListProps
 * @property files - Array of files
 * @property currentFileIndex - Index of the currently viewed file
 * @property onFileSelect - Function to handle file selection
 * @property series - Boolean to check if the files are being edited as a series
 */

export interface FileListProps {
    files: CustomFile[];
    currentFileIndex: number;
    onFileSelect: (index: number) => void;
    openModal: (value: boolean) => void;
    series: boolean;
}
/**
 * interface FileTableProps
 * @property files - Array of files
 * @property currentFileIndex - Index of the currently viewed file
 * @property onFileSelect - Function to handle file selection
 * @property series - Boolean to check if the files are being edited as a series
 */

export interface FileTableProps {
    files: any[];
    currentFileIndex: number;
    onFileSelect: (index: number) => void;
    series: boolean;
}

/**
 * interface FileNavigationProps
 */
export interface FileNavigationProps {
    currentFileIndex: number;
    fileCount: number;
    onPrevFile: () => void;
    onNextFile: () => void;
}

/**
 * interface FileData
 * @property name - Name of the file
 * @property content - File content
 */
export interface FileData {
    name: string;
    content: Blob;
}

/**
 * interface FileUploaderProps
 */
export interface FileUploaderProps {
    onFileUpload: (files: CustomFile[], dicomData: any[]) => void;
    loading: (value: boolean) => void;
    clearData: () => void;
    toggleModal: () => void;
}
/**
 * interface FileHeaderProps
 */

export interface FileHeaderProps {
    files: CustomFile[];
    currentFileIndex: number;
}
/**
 * interface DicomTableRowProps
 * @property row - DICOM tag row
 * @property index - Index of the row
 * @returns DicomTableRowProps
 * @description - Interface for the DicomTableRow component
 */
export interface CustomFile {
    name: string;
}
