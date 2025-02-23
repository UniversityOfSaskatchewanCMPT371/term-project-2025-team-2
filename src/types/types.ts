import { CustomFile } from "./FileTypes";

/**
 * Props for the Sidebar component
 * @interface SidebarProps
 * @property {File[]} files - Array of file objects
 * @property {(index: number) => void} onFileSelect - Function to handle file selection
 * @property {number} currentFileIndex - Index of the currently selected file
 * @property {boolean} series - Flag indicating if series mode is active
 * @property {() => void} seriesToggle - Function to toggle series mode
 * @property {boolean} isVisible - Flag indicating if the sidebar is visible
 * @property {() => void} updateAllFiles - Function to update all files
 * @property {(option: string) => void} setDownloadOption - Function to set the download option
 * @property {string} downloadOption - Currently selected download option
 */
export interface SidebarProps {
    files: CustomFile[];
    onFileSelect: (index: number) => void;
    currentFileIndex: number;
    series: boolean;
    seriesToggle: () => void;
    isVisible: boolean;
    updateAllFiles: () => void;
    downloadOption: string;
    setDownloadOption: (value: string) => void;
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
 * @param currTheme - Current theme
 */
export interface ThemeSelectorProps {
    toggleTheme: (e: any) => void;
    currTheme: string;
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
 * @param sidebarButtonRef - Ref for the sidebar toggle button
 * @param onInstallClick - Function to handle install click
 * @param showInstallButton - Boolean to determine if install button is shown
 * @param currTheme - Current theme
 */
export interface TopbarProps {
    toggleSidebar: () => void;
    sidebarVisible: boolean;
    toggleTheme: (e: any) => void;
    sidebarButtonRef: React.MutableRefObject<HTMLButtonElement | null>;
    onInstallClick: () => void;
    showInstallButton: boolean;
    currTheme: string;
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
    title: string;
    text: string;
}

/**
 * Props for the Header component
 * @interface HeaderProps
 * @property {() => void} toggleModal - Function to toggle the settings modal
 */
export interface HeaderProps {
    toggleModal: () => void;
}

/**
 * Props for the SeriesControls component
 * @interface SeriesControlsProps
 * @property {boolean} series - Flag indicating if series mode is active
 * @property {() => void} updateAllFiles - Function to update all files
 * @property {() => void} seriesToggle - Function to toggle series mode
 */
export interface SeriesControlsProps {
    series: boolean;
    updateAllFiles: () => void;
    seriesToggle: () => void;
}

/**
 * Props for the SettingsModal component
 * @interface SettingsModalProps
 * @property {() => void} toggleModal - Function to toggle the modal visibility
 * @property {File[]} files - Array of file objects
 * @property {(option: string) => void} setDownloadOption - Function to set the download option
 * @property {string} downloadOption - Currently selected download option
 */
export interface SettingsModalProps {
    toggleModal: () => void;
    files: CustomFile[];
    setDownloadOption: (option: string) => void;
    downloadOption: string;
}

/**
 * Props for the HelpModal component
 * @interface HelpModalProps
 */

export interface HelpModalProps {}

/**
 * Props for the DownloadOption component
 * @interface DownloadOptionProps
 * @property {(option: string) => void} setDownloadOption - Function to set the download option
 * @property {string} downloadOption - Currently selected download option
 */
export interface DownloadOptionProps {
    setDownloadOption: (option: string) => void;
    downloadOption: string;
}
