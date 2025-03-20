import { Tooltip } from "react-tooltip";
import { HiddenTagsProps } from "@type/types";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
import logger from "@logger/Logger";

/**
 * Hidden tags option component
 * @component
 * @precondition HiddenTagsOption component expects the following props
 * @postcondition HiddenTagsOption component renders a toggle to show/hide hidden tags
 * @param {HiddenTagsProps} props - Component props
 * @param {boolean} props.showHiddenTags - Flag indicating if hidden tags are shown, true/false
 * @param {(set: boolean) => void} props.setShowHiddenTags - Function to set the visibility of hidden tags
 * @returns {JSX.Element} Rendered HiddenTagsOption component
 */
export const HiddenTagsOption: React.FC<HiddenTagsProps> = ({
    showHiddenTags,
    setShowHiddenTags,
}) => {
    logger.debug("Rendering HiddenTagsOption component");

    return (
        <div>
            <p>Show Hidden Tags</p>
            <label className="label mb-2 cursor-pointer">
                <EyeSlashIcon className="size-6" />
                <input
                    className="toggle toggle-info"
                    type="checkbox"
                    id="hidden-tag-option"
                    checked={showHiddenTags}
                    onChange={(event) => {
                        if (event.target.checked) setShowHiddenTags(true);
                        else setShowHiddenTags(false);
                    }}
                    data-tooltip-id="hidden-tag-tooltip"
                    data-tooltip-content={
                        showHiddenTags ? "Hide Hidden Tags" : "Show Hidden Tags"
                    }
                    data-tooltip-place="top"
                />
                <EyeIcon className="size-6" />
            </label>
            <Tooltip id="hidden-tag-tooltip" />
        </div>
    );
};
