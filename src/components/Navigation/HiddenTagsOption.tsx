import { Tooltip } from "react-tooltip";
import { HiddenTagsProps } from "../../types/types";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
/**
 * Hidden tags option component
 * @component
 * @param {HiddenTagsProps} props - Component props
 * @param {boolean} props.showHiddenTags - Flag indicating if hidden tags are shown
 * @param {(set: boolean) => void} props.setShowHiddenTags - Function to set the visibility of hidden tags
 * @returns {JSX.Element} Rendered HiddenTagsOption component
 */
const HiddenTagsOption: React.FC<HiddenTagsProps> = ({
    showHiddenTags,
    setShowHiddenTags,
}) => {
    return (
        <div>
            <p>Show Hidden Tags</p>
            <label className="mb-4cursor-pointer label">
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

export { HiddenTagsOption };
