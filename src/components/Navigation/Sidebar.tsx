import React, { useState } from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { NavigationLinks } from "./NavigationLinks.tsx";
import { SidebarProps } from "../../types/types.ts";
import FileTable from "../FileHandling/FileTable.tsx";
import Modal from "../utils/Modal.tsx";

/**
 *
 * @param files - Array of files
 * @param onFileSelect - Function to handle file selection
 * @param currentFileIndex - Index of the currently viewed file
 * @returns rendered Sidebar component
 */
const Sidebar: React.FC<SidebarProps> = ({
    files,
    onFileSelect,
    currentFileIndex,
    series,
    seriesToggle,
    isVisible,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    return (
        <div
            className={`fixed right-0 top-0 h-full w-72 overflow-y-auto bg-base-200/95 backdrop-blur-sm shadow-lg transform transition-all duration-300 ease-in-out ${
                isVisible ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            <div className="flex flex-col p-6 pt-20">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-primary">Files</h3>
                    <QuestionMarkCircleIcon
                        className="size-6 cursor-pointer text-base-content/70 hover:text-primary transition-colors"
                        onClick={toggleModal}
                    />
                </div>

                <NavigationLinks />

                {files.length > 1 && (
                    <div className="mt-4 p-3 rounded-lg bg-base-300/50 backdrop-blur-sm">
                        <button
                            onClick={seriesToggle}
                            className="w-full text-sm font-medium px-3 py-2 rounded-md transition-all hover:bg-primary/10 hover:text-primary"
                        >
                            {series ? "✨ Editing as Series" : "🔄 Edit Individually"}
                        </button>
                    </div>
                )}

                <div className="mt-6">
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
                text="Add some text for usage help."
            />
        </div>
    );
};

export default Sidebar;
