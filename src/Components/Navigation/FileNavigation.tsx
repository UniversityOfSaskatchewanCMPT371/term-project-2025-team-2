import React from "react";
import { GenButton } from "../utils/GenButton";
import { FileNavigationProps } from "../../Features/FileHandling/Types/FileTypes";

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
    return (
        <div className="mt-4 flex justify-between">
            <GenButton
                onClick={onPrevFile}
                disabled={currentFileIndex === 0}
                label="Previous"
            />
            <GenButton
                onClick={onNextFile}
                disabled={currentFileIndex === fileCount - 1}
                label="Next"
            />
        </div>
    );
};
