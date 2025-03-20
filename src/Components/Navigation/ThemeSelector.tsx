import React, { useEffect } from "react";
import { Tooltip } from "react-tooltip";
import { ThemeSelectorProps } from "@type/types";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import logger from "@logger/Logger";
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
        logger.info(`Setting theme from ${currTheme}`);

        localStorage.setItem("theme", currTheme!);
        const localTheme = localStorage.getItem("theme");
        document.querySelector("html")?.setAttribute("data-theme", localTheme!);

        logger.info(`Theme set to ${localTheme}`);
    }, [currTheme]);

    logger.debug("Rendering ThemeSelector component");

    return (
        <div>
            <p>Set Theme</p>
            <label className="label mb-2 cursor-pointer">
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
