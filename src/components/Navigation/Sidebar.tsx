import React, { useState } from "react";
import { SidebarProps } from "../../types/types";
import FileTable from "../FileHandling/FileTable";
import Header from "./Header";
import SeriesControls from "./SeriesControls";
import SettingsModal from "./SettingsModal";
import HelpModal from "../utils/Modals/HelpModal";

/**
 * Main Sidebar component for file management and settings
 * @component
 * @param {SidebarProps} props - Component props
 * @param {File[]} props.files - Array of file objects
 * @param {(index: number) => void} props.onFileSelect - Function to handle file selection
 * @param {number} props.currentFileIndex - Index of the currently selected file
 * @param {boolean} props.series - Flag indicating if series mode is active
 * @param {() => void} props.seriesToggle - Function to toggle series mode
 * @param {boolean} props.isVisible - Flag indicating if the sidebar is visible
 * @param {() => void} props.updateAllFiles - Function to update all files
 * @param {(option: string) => void} props.setDownloadOption - Function to set the download option
 * @param {string} props.downloadOption - Currently selected download option
 * @param {boolean} props.showHiddenTags - Flag indicating if hidden tags are shown
 * @param {() => void} props.setShowHiddenTags - Function to toggle hidden tags visibility
 * @returns {JSX.Element} Rendered Sidebar component
 * @example
 * ```tsx
 * <Sidebar
 *   files={fileArray}
 *   onFileSelect={handleFileSelect}
 *   currentFileIndex={0}
 *   series={false}
 *   seriesToggle={() => {}}
 *   isVisible={true}
 *   updateAllFiles={() => {}}
 *   setDownloadOption={(option) => {}}
 *   downloadOption="zip"
 *   showHiddenTags={false}
 *   setShowHiddenTags={(set) => {}}
 * />
 * ```
 */
const Sidebar: React.FC<SidebarProps> = ({
    files,
    onFileSelect,
    currentFileIndex,
    series,
    seriesToggle,
    isVisible,
    updateAllFiles,
    setDownloadOption,
    downloadOption,
    showHiddenTags,
    setShowHiddenTags,
    currTheme,
    toggleTheme,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    return (
        <div
            className={`fixed right-0 top-0 h-full w-72 transform overflow-y-auto bg-base-200/95 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out ${
                isVisible ? "translate-x-0" : "translate-x-full"
            }`}
        >
            <div className="mt-4 flex flex-col p-6 pt-20">
                <Header toggleModal={toggleModal} />

                {files.length > 1 && (
                    <SeriesControls
                        series={series}
                        updateAllFiles={updateAllFiles}
                        seriesToggle={seriesToggle}
                    />
                )}

                <div className="mt-2">
                    <FileTable
                        files={files}
                        currentFileIndex={currentFileIndex}
                        onFileSelect={onFileSelect}
                        series={series}
                    />
                </div>
            </div>

            {isModalOpen && (
                <SettingsModal
                    toggleModal={toggleModal}
                    files={files}
                    setDownloadOption={setDownloadOption}
                    downloadOption={downloadOption}
                    showHiddenTags={showHiddenTags}
                    setShowHiddenTags={setShowHiddenTags}
                    currTheme={currTheme}
                    toggleTheme={toggleTheme}
                />
            )}

            <HelpModal />
        </div>
    );
};

export default Sidebar;
