import React from "react";
import { FileListProps } from "../../types/types.ts";

/**
 *
 * @param files - Array of files
 * @param currentFileIndex - Index of the currently viewed file
 * @param onFileSelect - Function to handle file selection
 * @returns rendered FileList component
 */
const FileTableBody: React.FC<FileListProps> = ({
    files,
    currentFileIndex,
    onFileSelect,
    series,
    openModal,
}) => {
    return (
        <>
            <tbody className="pt-8">
                {files.length > 0 ? (
                    files.map((file, index) => (
                        <tr key={index}>
                            <td
                                key={index}
                                className={`cursor-pointer py-1 pl-4 text-secondary-content hover:text-accent hover:outline ${
                                    index === currentFileIndex
                                        ? "font-semibold text-accent"
                                        : ""
                                }`}
                                onClick={
                                    !series
                                        ? () => onFileSelect(index)
                                        : () => openModal(true)
                                }
                            >
                                {file.name}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr className="py-1 pl-4 text-neutral-content">
                        <td>No files uploaded</td>
                    </tr>
                )}
            </tbody>
        </>
    );
};

export default FileTableBody;
