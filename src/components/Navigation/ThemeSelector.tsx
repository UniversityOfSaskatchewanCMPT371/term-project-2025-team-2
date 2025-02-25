import { Tooltip } from "react-tooltip";
import { ThemeSelectorProps } from "../../types/types";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
/**
 * Hidden tags option component
 * @component
 * @param {HiddenTagsProps} props - Component props
 * @param {boolean} props.showHiddenTags - Flag indicating if hidden tags are shown
 * @param {(set: boolean) => void} props.setShowHiddenTags - Function to set the visibility of hidden tags
 * @returns {JSX.Element} Rendered HiddenTagsOption component
 */
const ThemeSelector: React.FC<ThemeSelectorProps> = ({
    toggleTheme,
    currTheme,
}) => {
    return (
        <div>
            <p>Set Theme</p>
            <label className="mb-4cursor-pointer label">
                <MoonIcon className="size-6" />
                <input
                    className="toggle toggle-info"
                    type="checkbox"
                    id="theme-option"
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

export { ThemeSelector };
