import React from "react";
import { Tooltip } from "react-tooltip";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { ThemeSelectorProps } from "../../types/types";

/**
 *
 * @param toggleTheme - Function to toggle theme
 * @param currTheme - Current theme
 * @returns rendered ThemeSelector component
 */
export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
    toggleTheme,
    currTheme,
}) => {
    return (
        <label
            className="swap swap-rotate transition-all duration-500 hover:text-accent"
            data-tooltip-id="theme-tooltip"
            data-tooltip-content="Change Theme"
            data-tooltip-place="bottom"
        >
            <Tooltip id="theme-tooltip" />
            <input type="checkbox" onChange={toggleTheme} />
            {currTheme === "night" ? (
                <SunIcon className="size-6" />
            ) : (
                <MoonIcon className="size-6" />
            )}
        </label>
    );
};
