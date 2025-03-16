import React from "react";
import { Tooltip } from "react-tooltip";
import logger from "@logger/Logger";
import { useStore } from "@state/Store";

/**
 * Download option component
 * @component
 * @precondition DownloadOption component expects the following props
 * @postcondition DownloadOption component renders a toggle to switch between downloading individual files and a zip file
 * @param {DownloadOptionProps} props - Component props
 * @returns {JSX.Element} Rendered DownloadOption component
 */
export const EditOption: React.FC = () => {
    const allowEditLockedTags = useStore((state) => state.allowEditLockedTags);
    const setAllowEditLockedTags = useStore(
        (state) => state.setAllowEditLockedTags
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setAllowEditLockedTags(true);
            logger.info("Allow Edit Locked Tags");
        } else {
            setAllowEditLockedTags(false);
            logger.info("Disallow Edit Locked Tags");
        }
    };

    logger.debug("Rendering EditOption component");

    return (
        <div>
            <label className="label mb-6 cursor-pointer">
                <input
                    className="toggle toggle-error"
                    type="checkbox"
                    id="edit-option"
                    checked={allowEditLockedTags}
                    onChange={handleChange}
                    data-tooltip-id="edit-option-button-tooltip"
                    data-tooltip-content="Dangerous - Edit Locked Tags"
                    data-tooltip-place="top"
                />
                <div
                    className={`${allowEditLockedTags ? "text-error" : "text-base-content"}`}
                >
                    Allow Edit Locked Tags
                </div>
            </label>
            <Tooltip id="edit-option-button-tooltip" />
        </div>
    );
};
