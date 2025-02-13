import React from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { ThemeSelectorProps } from "../../types/types";

/**
 *
 * @param toggleTheme - Function to toggle theme
 * @returns rendered ThemeSelector component
 */
export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
    toggleTheme,
}) => {
    return (
        <label className="swap swap-rotate transition-all duration-500 hover:text-accent">
            <input type="checkbox" onChange={toggleTheme} />
            <SunIcon className="swap-off size-6" />
            <MoonIcon className="swap-on size-6" />
        </label>
    );
};
