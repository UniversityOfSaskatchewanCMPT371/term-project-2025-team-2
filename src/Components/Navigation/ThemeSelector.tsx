import React, { useEffect } from "react";
import { Tooltip } from "react-tooltip";
import { ThemeSelectorProps } from "../../types/types";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

import { useStore } from "@state/Store";

/**
 * Hidden tags option component
 * @component
 * @precondition HiddenTagsOption component expects the following props
 * @postcondition HiddenTagsOption component renders a toggle to show/hide hidden tags
 * @param {ThemeSelectorProps} props - Component props
 * @returns {JSX.Element} Rendered HiddenTagsOption component
 */
export const ThemeSelector: React.FC<ThemeSelectorProps> = () => {
    const toggleTheme = useStore((state) => state.toggleTheme);
    const currTheme = useStore((state) => state.theme);

    // Set theme on load
    useEffect(() => {
        localStorage.setItem("theme", currTheme!);
        const localTheme = localStorage.getItem("theme");
        document.querySelector("html")?.setAttribute("data-theme", localTheme!);
    }, [currTheme]);

    return (
        <div>
            <p>Set Theme</p>
            <label className="mb-4cursor-pointer label">
                <MoonIcon className="size-6" />
                <input
                    className="toggle toggle-info"
                    type="checkbox"
                    id="theme-option"
                    data-testid="checkbox"
                    checked={currTheme === "corporate"}
                    onChange={toggleTheme}
                    data-tooltip-id="theme-tooltip"
                    data-tooltip-content={
                        currTheme === "night"
                            ? "Switch to Light"
                            : "Switch to Dark"
                    }
                    data-tooltip-place="top"
                />
                <SunIcon className="size-6" />
            </label>
            <Tooltip id="theme-tooltip" />
        </div>
    );
};
