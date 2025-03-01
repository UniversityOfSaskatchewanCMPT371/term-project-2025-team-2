import { CustomFile } from "./FileTypes";

/**
 * Props for the Sidebar component
 * @interface SidebarProps
 * @property {boolean} isVisible - Flag indicating if the sidebar is visible
 * @property {(set: boolean) => void} setShowHiddenTags - Function to set the visibility of hidden tags
 */
export interface SidebarProps {
    isVisible: boolean;
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
 */
export interface ThemeSelectorProps {}

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
    sidebarButtonRef: React.RefObject<HTMLButtonElement | null>;
    onInstallClick: () => void;
    showInstallButton: boolean;
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
export interface SeriesControlsProps {}

/**
 * Props for the SettingsModal component
 * @interface SettingsModalProps
 * @property {() => void} toggleModal - Function to toggle the modal visibility
 * @property {File[]} files - Array of file objects
 * @property {(option: string) => void} setDownloadOption - Function to set the download option
 * @property {string} downloadOption - Currently selected download option
 * @property {boolean} showHiddenTags - Flag indicating if hidden tags are shown
 * @property {(set: boolean) => void} setShowHiddenTags - Function to set the visibility of hidden tags
 */
export interface SettingsModalProps {
    toggleModal: () => void;
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

/**
 * Props for the HiddenTagsOption component
 * @interface HiddenTagsProps
 * @property {boolean} showHiddenTags - Flag indicating if hidden tags are shown
 * @property {(set: boolean) => void} setShowHiddenTags - Function to set the visibility of hidden tags
 */
export interface HiddenTagsProps {
    showHiddenTags: boolean;
    setShowHiddenTags: (set: boolean) => void;
}
