import React from "react";
import { FileHeaderProps } from "../Types/FileTypes";

/**
 * File header component
 * @component
 * @description Header for the currently viewed file
 * @precondition FileHeader component expects the following props
 * @precondition files - Array of files
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
