import { CustomFile } from "./FileTypes";

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
    updateAllFiles: () => void;
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
