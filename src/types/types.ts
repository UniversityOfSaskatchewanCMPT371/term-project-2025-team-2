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
export interface CustomFile {
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
    files: CustomFile[];
    onFileSelect: (index: number) => void;
    currentFileIndex: number;
    series: boolean;
    seriesToggle: () => void;
    isVisible: boolean;
}

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
 * interface AppState
 * @property files - Array of files
 * @property dicomData - Array of dicom data
 * @property currentFileIndex - Index of the currently viewed file
 * @returns AppState
 * @description - Interface for the AppState
 */
export interface AppState {
    files: CustomFile[];
    dicomData: any[];
    currentFileIndex: number;
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
 * interface FileUploaderProps
 */
export interface FileUploaderProps {
    onFileUpload: (files: CustomFile[], dicomData: any[]) => void;
}

/**
 * interface FileHeaderProps
 */
export interface FileHeaderProps {
    files: CustomFile[];
    currentFileIndex: number;
}

/**
 * interface HelpIconProps
 * @param onClick - Function to handle help icon click
 * @param icon - Icon to render
 * @returns rendered Icon Button component
 */
export interface IconButtonProps {
    onClick: () => void;
    icon: string;
}

/**
 * interface ThemeSelectorProps
 * @param toggleTheme - Function to toggle theme
 */
export interface ThemeSelectorProps {
    toggleTheme: (e: any) => void;
}

/**
 * interface NavButtonProps
 * @param onClick - Function to handle button click
 * @param disabled - Boolean to determine if button is disabled
 * @param label - Button label
 */
export interface GenButtonProps {
    onClick: () => void;
    disabled: boolean;
    label: string;
}

/**
 * interface TopbarProps
 * @param toggleSidebar - Function to toggle sidebar visibility
 * @param sidebarVisible - Boolean to determine if sidebar is visible
 * @param toggleTheme - Function to toggle theme
 */
export interface TopbarProps {
    toggleSidebar: () => void;
    sidebarVisible: boolean;
    toggleTheme: (e: any) => void;
}

/**
 * interface ModalProps
 * @param isOpen - Boolean to determine if modal is open
 * @param onClose - Function to handle modal close
 * @param title - Modal title
 * @param text - Modal text
 */
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    text: string;
}

/**
 * interface SearchProps
 * @param searchTerm - Current search term
 * @param onSearchChange - Function to handle search term change
 */
export interface SearchProps {
    searchTerm: string;
    onSearchChange: (newSearchTerm: string) => void;
}

/**
 * interface ErrorBoundaryProps
 * children: React.ReactNode
 * fallback: React.ReactNode
 */
export interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback: React.ReactNode;
}

/**
 * interface GenErrorPageProps
 * error: Error
 */
export interface GenErrorPageProps {
    error: Error;
}

/**
 * interface QuestionModalProps
 * @param setSeries - Function to set series
 * @param setIsOpen - Function to set modal open state
 */
export interface QuestionModalProps {
    setSeries: (value: boolean) => void;
    setIsOpen: (value: boolean) => void;
}
