import React from "react";

/**
 * interface FileHeaderProps
 */
interface FileHeaderProps {
    files: File[];
    currentFileIndex: number;
}

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
        <h2 className="mb-4 mt-4 text-xl font-bold text-base-content">
            Currently Viewing: {files[currentFileIndex].name}
        </h2>
    );
};
