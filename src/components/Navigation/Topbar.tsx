import React from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { ThemeSelector } from "./ThemeSelector";
import { TopbarProps } from "../../types/types";

/**
 *
 * @param toggleSidebar - Function to toggle sidebar visibility
 * @param toggleTheme - Function to toggle theme
 * @param sidebarButtonRef - Ref for the sidebar button
 * @returns rendered Topbar component
 */
const Topbar: React.FC<TopbarProps> = ({ toggleSidebar, sidebarVisible, toggleTheme, sidebarButtonRef }) => {
    return (
        <div className="sticky top-0 z-20 w-full backdrop-blur-sm bg-base-100/80 shadow-md">
            <div className="relative flex items-center justify-between px-6 py-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    DICOM Tag Editor
                </h1>
                
                <div className="flex items-center gap-4">
                    <ThemeSelector toggleTheme={toggleTheme} />
                    <button
                        ref={sidebarButtonRef}
                        onClick={toggleSidebar}
                        className="p-1"
                    >
                        <Bars3Icon
                            className={`size-8 cursor-pointer transition-all duration-300 hover:text-primary ${
                                sidebarVisible ? 'rotate-180' : ''
                            }`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
