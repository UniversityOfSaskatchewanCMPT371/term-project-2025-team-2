/**
 * interface FileListProps
 * @property files - Array of files
 * @property currentFileIndex - Index of the currently viewed file
 * @property onFileSelect - Function to handle file selection
 * @property series - Boolean to check if the files are being edited as a series
 */

export interface FileListProps {
    openModal: (value: boolean) => void;
}
/**
 * interface FileTableProps
 * @property files - Array of files
 * @property currentFileIndex - Index of the currently viewed file
 * @property onFileSelect - Function to handle file selection
 * @property series - Boolean to check if the files are being edited as a series
 */

export interface FileTableProps {}

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
    filePath?: string;
    path?: string;
    metadata?: {
        size?: number;
        sizeFormatted?: string;
        lastModified?: string;
        creationDate?: string;
    };
}

/**
 * interface FileUploaderProps
 */
export interface FileUploaderProps {
    onFileUpload: (files: FileData[], dicomData: any[]) => void;
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

// Enhanced File type with metadata
export interface EnhancedFile extends File {
    metadata?: {
        size: number;
        lastModified: string;
        sizeFormatted: string;
    };
}


