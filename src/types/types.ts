/**
 * interface DicomTag
 * @property tagName - Name of the DICOM tag
 * @property value - Value of the DICOM tag
 * @returns DicomTag
 */
export interface DicomTag {
    tagName: string;
    value: string | DicomTag[];
    hidden?: boolean;
}

/**
 * interface DicomTableProps
 * @property dicomData - DICOM data
 * @returns DicomTableProps
 * @description - Interface for the DicomTable component
 */
export interface DicomTableProps {
    dicomData: { [key: string]: DicomTag };
    fileName: string;
}

/**
 * interface DicomTableRowProps
 * @property row - DICOM tag row
 * @property index - Index of the row
 * @returns DicomTableRowProps
 * @description - Interface for the DicomTableRow component
 */
export interface File {
    name: string;
}

/**
 * interface SidebarProps
 * @property files - Array of files
 * @property onFileSelect - Function to handle file selection
 * @property currentFileIndex - Index of the currently viewed file
 * @returns SidebarProps
 * @description - Interface for the Sidebar component
 */
export interface SidebarProps {
    files: File[];
    onFileSelect: (index: number) => void;
    currentFileIndex: number;
}

/**
 * interface AppState
 * @property files - Array of files
 * @property dicomData - Array of dicom data
 * @property currentFileIndex - Index of the currently viewed file
 * @returns AppState
 * @description - Interface for the AppState
 */
export interface AppState {
    files: File[];
    dicomData: any[];
    currentFileIndex: number;
}
