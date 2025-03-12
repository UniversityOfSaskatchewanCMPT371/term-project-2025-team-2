import React from "react";
import { FileHeaderProps } from "../Types/FileTypes";

/**
 *
 * @param files - Array of files
 * @param currentFileIndex - Index of the currently viewed file
 * @returns rendered FileHeader component
 */
export const FileHeader: React.FC<FileHeaderProps> = ({
    files,
    currentFileIndex,
}) => {
    if (files.length === 0) return null;

    return (
        <h2 className="mb-4 mt-4 text-xl text-base-content">
            Currently Viewing: {files[currentFileIndex].name}
        </h2>
    );
};
