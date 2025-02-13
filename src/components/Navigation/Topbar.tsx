import React from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { ThemeSelector } from "./ThemeSelector";
import { TopbarProps } from "../../types/types";

/**
 *
 * @param toggleSidebar - Function to toggle sidebar visibility
 * @param toggleTheme - Function to toggle theme
 * @returns rendered Topbar component
 */
const Topbar: React.FC<TopbarProps> = ({ toggleSidebar, toggleTheme }) => {
    return (
        <div className="relative z-10 flex items-center justify-between bg-primary p-4 text-white">
            <ThemeSelector toggleTheme={toggleTheme} />

            <h1 className="text-2xl">DICOM Tag Editor</h1>

            <Bars3Icon
                className="size-8 transition-all duration-500 hover:text-accent"
                onClick={toggleSidebar}
            />

        </div>
    );
};

export default Topbar;
