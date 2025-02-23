import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import { Cog6ToothIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { SidebarProps } from "../../types/types.ts";
import FileTable from "../FileHandling/FileTable.tsx";
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
            className={`fixed right-0 top-0 h-full w-72 transform overflow-y-auto bg-base-200/95 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out ${isVisible ? "translate-x-0" : "translate-x-full"
                }`}
        >
            <div className="mt-4 flex flex-col p-6 pt-20">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-primary">Files</h3>
                    <Cog6ToothIcon
                        className="size-6 cursor-pointer text-base-content/70 transition-colors hover:scale-110 hover:text-accent"
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

            {isModalOpen && (
                <div
                    role="dialog"
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={toggleModal}
                >
                    <div
                        className="w-full max-w-sm rounded bg-base-100 p-6 text-base-content shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="text-xl font-semibold mb-4">Settings</h4>
                            <QuestionMarkCircleIcon className="size-6 mb-4 text-base-content/70 cursor-pointer transition-colors hover:scale-110 hover:text-accent" onClick={() => {
                                const helpModal = document.getElementById('help_modal');
                                if (helpModal) {
                                    (helpModal as HTMLDialogElement).showModal();
                                }
                            }} />
                        </div>

                        {files.length > 1 ? (
                            <>
                                <p>Download Option</p>
                                <DownloadOption
                                    setDownloadOption={setDownloadOption}
                                    downloadOption={downloadOption}
                                />
                            </>
                        ) : (<div className="mb-4">No Options</div>)}

                        <GenButton onClick={toggleModal} disabled={false} label="Close" />
                    </div>

                    <dialog id="help_modal" className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box">
                            <h3 className="font-bold text-2xl">Help</h3>
                            <div className="font-semibold text-lg py-4">Dicom tag Editor Options</div>
                                <ul>
                                    <li>Edit tag values or remove tags</li>
                                    <li>Toggle between editing files individually or as a series</li>
                                    <li>Download files as a zip or individual files</li>
                                </ul>
                                <div className="mt-4">
                                    <a href="https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2025-team-2"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="link link-info">Detailed User Guide</a>
                                </div>
                            <div className="modal-action">
                                <form method="dialog">
                                    <GenButton onClick={() => {
                                        const helpModal = document.getElementById('help_modal');
                                        if (helpModal) {
                                            (helpModal as HTMLDialogElement).close();
                                        }
                                    }} disabled={false} label="Close" />
                                </form>
                            </div>
                        </div>
                    </dialog>

                </div>
            )}

        </div>
    );
};

export default Sidebar;
