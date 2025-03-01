import React, { useState } from "react";
import { SidebarProps } from "../../types/types";
import FileTable from "../FileHandling/FileTable";
import Header from "./Header";
import SeriesControls from "./SeriesControls";
import SettingsModal from "./SettingsModal";
import HelpModal from "../utils/Modals/HelpModal";

import { useStore } from "../State/Store";

/**
 * Main Sidebar component for file management and settings
 * @component
 * @param {SidebarProps} props - Component props
 * @param {boolean} props.isVisible - Flag indicating if the sidebar is visible
 * @returns {JSX.Element} Rendered Sidebar component
 */
const Sidebar: React.FC<SidebarProps> = ({ isVisible }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const setCurrentFileIndex = useStore((state) => state.setCurrentFileIndex);
    const files = useStore((state) => state.files);
    const series = useStore((state) => state.series);
    const currentFileIndex = useStore((state) => state.currentFileIndex);

    return (
        <div
            className={`fixed right-0 top-0 h-full w-72 transform overflow-y-auto bg-base-200/95 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out ${isVisible ? "translate-x-0" : "translate-x-full"}`}
        >
            <div className="mt-4 flex flex-col p-6 pt-20">
                <Header toggleModal={toggleModal} />

                {files.length > 1 && <SeriesControls />}

                <div className="mt-2">
                    <FileTable
                        files={files}
                        currentFileIndex={currentFileIndex}
                        onFileSelect={setCurrentFileIndex}
                        series={series}
                    />
                </div>
            </div>

            {isModalOpen && <SettingsModal toggleModal={toggleModal} />}

            <HelpModal />
        </div>
    );
};

export default Sidebar;
