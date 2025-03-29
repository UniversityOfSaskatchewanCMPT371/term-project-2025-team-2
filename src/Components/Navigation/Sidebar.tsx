import React, { useState } from "react";
import { SidebarProps } from "@type/types";
import { FileTable } from "@features/FileHandling/Components/FileTable";
import { Header } from "./Header";
import { SeriesControls } from "./SeriesControls";
import { SettingsModal } from "./SettingsModal";
import logger from "@logger/Logger";
import { useStore } from "@state/Store";

/**
 * Main Sidebar component for file management and settings
 * @component
 * @precondition Sidebar component expects the following props
 * @postcondition Sidebar component renders a sidebar for file management and settings
 * @param {SidebarProps} props - Component props
 * @param {boolean} props.isVisible - Flag indicating if the sidebar is visible, true/false
 * @returns {JSX.Element} Rendered Sidebar component
 */
const Sidebar: React.FC<SidebarProps> = ({ isVisible }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const files = useStore((state) => state.files);

    logger.debug("Rendering Sidebar");

    return (
        <div
            className={`fixed right-0 top-0 h-full w-80 transform overflow-y-auto bg-base-200/95 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out ${isVisible ? "translate-x-0" : "translate-x-full"}`}
        >
            <div className="mt-4 flex flex-col p-6 pt-20">
                <Header toggleModal={toggleModal} />

                {files.length > 1 && <SeriesControls />}

                <div className="mt-2">
                    <FileTable />
                </div>
            </div>

            {isModalOpen && <SettingsModal toggleModal={toggleModal} />}
        </div>
    );
};

export default Sidebar;
