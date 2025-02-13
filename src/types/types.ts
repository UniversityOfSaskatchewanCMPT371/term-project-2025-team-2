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
    updateTableData: (data: any) => void;
    newTableData: any[];
}

/**
 * interface DicomTableRowProps
 * @property row - DICOM tag row
 * @property index - Index of the row
 * @property onUpdateValue - Function to update the value of the row
 * @property nested - Boolean to check if the row is nested
 * @property updated - Boolean to check if the row has been updated
 */
export interface DicomTableRowProps {
    row: {
        tagId: string;
        tagName: string;
        value: string | any[];
    };
    index: number;
    onUpdateValue: (tagId: string, newValue: string) => void;
    nested?: boolean;
    updated?: boolean;
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
