import React, { useState } from "react";
import { NavigationLinks } from "./NavigationLinks.tsx";
import { SidebarProps } from "../../types/types.ts";
import FileTable from "../FileHandling/FileTable.tsx";
import IconButton from "../utils/IconButton.tsx";
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
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    return (
        <div className="z-1 fixed right-0 top-0 h-full w-64 overflow-y-auto bg-secondary p-6 py-20 text-secondary-content">
            <h3 className="mb-2 mt-2 text-xl font-semibold">Sidebar</h3>

            <div
                className="absolute left-3/4 top-7 mt-14 -translate-x-1/2 transform"

            >
                <IconButton onClick={toggleModal} icon={"help"} />
            </div>

            <NavigationLinks />

            <FileTable
                files={files}
                currentFileIndex={currentFileIndex}
                onFileSelect={onFileSelect}
            />

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
