import React, { useState } from "react";
import { NavigationLinks } from "./NavigationLinks.tsx";
import { SidebarProps } from "../../types/types.ts";
import FileTable from "../FileHandling/FileTable.tsx";
import HelpIcon from "../utils/HelpIcon.tsx";
import Modal from "../utils/Modal.tsx";

const Sidebar: React.FC<SidebarProps> = ({
    files,
    onFileSelect,
    currentFileIndex,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    return (
        <div className="fixed right-0 top-0 h-full w-64 bg-secondary p-6 text-secondary-content">
            <h3 className="mb-2 mt-20 text-xl font-semibold">Sidebar</h3>

            <NavigationLinks />

            <FileTable
                files={files}
                currentFileIndex={currentFileIndex}
                onFileSelect={onFileSelect}
            />

            <HelpIcon onClick={toggleModal} />

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
