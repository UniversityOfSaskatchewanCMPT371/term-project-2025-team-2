import React from "react";
import { FileHeaderProps } from "../Types/FileTypes";
import logger from "@logger/Logger";

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

    logger.debug("Rendering FileHeader component");

    return (
        <div className="flex-col-2 flex items-center justify-between">
            <h2 className="mb-4 mt-4 flex text-xl text-base-content">
                Currently Viewing: {files[currentFileIndex].name}
            </h2>

            {files.length > 1 ? (
                <div>
                    <p className="flex text-xl text-base-content">
                        Showing File: {currentFileIndex + 1} of {files.length}
                    </p>
                </div>
            ) : (
                ""
            )}
        </div>
    );
};
