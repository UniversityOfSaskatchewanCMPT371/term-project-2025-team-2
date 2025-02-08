// Topbar Component
import React from "react";
import { ThemeSelector } from "./ThemeSelector"; // Import the ThemeSelector component

interface TopbarProps {
    toggleSidebar: () => void;
    sidebarVisible: boolean;
    toggleTheme: (e: any) => void;
}

const Topbar: React.FC<TopbarProps> = ({ toggleSidebar, toggleTheme }) => {
    return (
        <div className="relative z-10 flex items-center justify-between bg-primary p-4 text-white">
            {/* Theme Selector Component */}
            <ThemeSelector toggleTheme={toggleTheme} />

            <h1 className="text-2xl">DICOM Tag Editor</h1>

            <button
                onClick={toggleSidebar}
                className={`text-3xl text-white transition-all duration-500 hover:text-secondary`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-8"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                </svg>
            </button>
        </div>
    );
};

export default Topbar;
