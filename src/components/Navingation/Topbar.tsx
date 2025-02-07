import React from "react";

interface TopbarProps {
    toggleSidebar: () => void;
    sidebarVisible: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ toggleSidebar }) => {
    return (
        <div className="relative z-10 flex items-center justify-between bg-blue-500 p-4 text-white">
            <h1 className="text-2xl">DICOM Tag Editor</h1>

            <button
                onClick={toggleSidebar}
                className={`text-3xl text-white transition-all duration-300`}
            >
                &#9776;
            </button>
        </div>
    );
};

export default Topbar;
