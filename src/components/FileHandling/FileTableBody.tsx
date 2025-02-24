import React from "react";
import { FileListProps } from "../../types/FileTypes.ts";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

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
        <tbody>
            {files.map((file, index) => (
                <tr
                    key={index}
                    onClick={
                        !series
                            ? () => onFileSelect(index)
                            : () => openModal(true)  
                    }
                    className={`group cursor-pointer transition-all hover:bg-primary/5 ${
                        index === currentFileIndex ? "bg-primary/10" : ""
                    }`}
                >
                    <td className="flex items-center gap-3 rounded-lg px-3 py-2">
                        <DocumentTextIcon
                            className={`size-5 ${
                                index === currentFileIndex
                                    ? "text-primary"
                                    : "text-base-content/50 group-hover:text-primary/70"
                            }`}
                        />
                        <span
                            className={`text-sm ${
                                index === currentFileIndex
                                    ? "font-medium text-primary"
                                    : "text-base-content/70 group-hover:text-base-content"
                            }`}
                        >
                            {file.name}
                        </span>
                    </td>
                </tr>
            ))}
        </tbody>
    );
};

export default FileTableBody;
