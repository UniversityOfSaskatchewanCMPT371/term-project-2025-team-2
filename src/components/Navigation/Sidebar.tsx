import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { SidebarProps } from "../../types/types.ts";
import FileTable from "../FileHandling/FileTable.tsx";
import Modal from "../utils/Modal.tsx";
import { GenButton } from "../utils/GenButton.tsx";
import DownloadOption from "../utils/DownloadOption.tsx";

/**
 * @description Sidebar component
 * @param files - Array of files
 * @param onFileSelect - Function to handle file selection
 * @param currentFileIndex - Index of the currently viewed file
 * @param series - Boolean to check if the files are being edited as a series
 * @param seriesToggle - Function to toggle series mode
 * @param isVisible - Boolean to check if the sidebar is visible
 * @param updateAllFiles - Function to update all files
 * @returns rendered Sidebar component
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
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-primary">Files</h3>
                    {files.length > 1 && (
                        <DownloadOption
                            setDownloadOption={setDownloadOption}
                            downloadOption={downloadOption}
                        />
                    )}
                    <QuestionMarkCircleIcon
                        className="size-6 cursor-pointer text-base-content/70 transition-colors hover:text-primary"
                        onClick={toggleModal}
                    />
                </div>

                {files.length > 1 && (
                    <>
                        <GenButton
                            label={
                                series
                                    ? "Apply Edits to All Files"
                                    : "Save All Files"
                            }
                            disabled={false}
                            onClick={updateAllFiles}
                        />
                        <div className="mt-4 rounded-lg bg-base-300/50 p-3 backdrop-blur-sm">
                            <button
                                onClick={seriesToggle}
                                className="w-full rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary"
                                data-tooltip-id="series-button-tooltip"
                                data-tooltip-content={
                                    series
                                        ? "Click to edit individually"
                                        : "Click to edit as series"
                                }
                                data-tooltip-place="top"
                            >
                                {series
                                    ? "✨ Editing as Series"
                                    : "🔄 Editing Individually"}
                            </button>
                            <Tooltip id="series-button-tooltip" />
                        </div>
                    </>
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

            <Modal
                isOpen={isModalOpen}
                onClose={toggleModal}
                title="Help"
                text="Here, you can view all your uploaded DICOM files. Switch between editing them as a series or individually, and save all edited files at once."
            />
        </div>
    );
};

export default Sidebar;
