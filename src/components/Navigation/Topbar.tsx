import React from "react";
import { ThemeSelector } from "./ThemeSelector"; // Import the ThemeSelector component

/**
 * interface TopbarProps
 * @param toggleSidebar - Function to toggle sidebar visibility
 * @param sidebarVisible - Boolean to determine if sidebar is visible
 * @param toggleTheme - Function to toggle theme
 */
interface TopbarProps {
    toggleSidebar: () => void;
    sidebarVisible: boolean;
    toggleTheme: (e: any) => void;
}

/**
 *
 * @param toggleSidebar - Function to toggle sidebar visibility
 * @param toggleTheme - Function to toggle theme
 * @returns rendered Topbar component
 */
const Topbar: React.FC<TopbarProps> = ({ toggleSidebar, toggleTheme }) => {
    return (
        <div className="sticky top-0 z-20 flex items-center justify-between bg-primary px-4 py-3 shadow-md md:px-8">
            <h1 className="text-xl font-semibold text-white md:text-2xl">
                DICOM Tag Editor
            </h1>

            <div className="flex items-center gap-4">
                <ThemeSelector toggleTheme={toggleTheme} />
                <button
                    onClick={toggleSidebar}
                    data-sidebar-toggle
                    className="rounded-lg p-2 text-white transition-all duration-300 hover:bg-primary-focus"
                    aria-label="Toggle sidebar"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Topbar;
