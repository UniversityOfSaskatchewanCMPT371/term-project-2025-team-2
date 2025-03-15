import React from "react";
import { GenButton } from "../utils/GenButton";
import { FileNavigationProps } from "@features/FileHandling/Types/FileTypes";
import { Tooltip } from "react-tooltip";
import logger from "../../Logger/Logger";

/**
 * File navigation component
 * @component
 * @precondition - FileNavigation component expects the following props
 * @postcondition - FileNavigation component renders a navigation bar to navigate between files
 * @param currentFileIndex - Index of the currently viewed file
 * @param fileCount - Total number of files
 * @param onPrevFile - Function to handle previous file navigation
 * @param onNextFile - Function to handle next file navigation
 * @returns rendered FileNavigation component
 */
export const FileNavigation: React.FC<FileNavigationProps> = ({
    currentFileIndex,
    fileCount,
    onPrevFile,
    onNextFile,
}) => {
    logger.debug("Rendering FileNavigation component");

    return (
        <div className="mt-4 flex justify-between">
            <div
                data-tooltip-id="prev-button-tooltip"
                data-tooltip-content={
                    currentFileIndex === 0
                        ? "On first file"
                        : "Move to previous file"
                }
                data-tooltip-place="right"
            >
                <GenButton
                    onClick={onPrevFile}
                    disabled={currentFileIndex === 0}
                    label="Previous"
                />
            </div>
            <div
                data-tooltip-id="next-button-tooltip"
                data-tooltip-content={
                    currentFileIndex === fileCount - 1
                        ? "On last file"
                        : "Move to next file"
                }
                data-tooltip-place="left"
            >
                <GenButton
                    onClick={onNextFile}
                    disabled={currentFileIndex === fileCount - 1}
                    label="Next"
                />
            </div>
            <Tooltip id="prev-button-tooltip" />
            <Tooltip id="next-button-tooltip" />
        </div>
    );
};
