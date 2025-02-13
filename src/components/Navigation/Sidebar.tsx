import React, { useState } from "react";
import { NavigationLinks } from "./NavigationLinks.tsx";
import { SidebarProps } from "../../types/types.ts";
import FileTable from "../FileHandling/FileTable.tsx";
import HelpIcon from "../utils/HelpIcon.tsx";
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
        <div className="fixed right-0 top-0 w-64 py-20 h-full bg-secondary p-6 z-1 text-secondary-content overflow-y-auto">
            <h3 className="mb-2 mt-2 text-xl font-semibold">Sidebar</h3>
            
            <HelpIcon onClick={toggleModal} />

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
