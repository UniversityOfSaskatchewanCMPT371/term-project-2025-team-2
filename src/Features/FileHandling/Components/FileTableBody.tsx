import React from "react";
import { FileListProps } from "../Types/FileTypes";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import logger from "@logger/Logger";
import { useStore } from "@state/Store.tsx";

/**
 * FileTableBody component - renders the body of the file table
 * @component
 * @precondition FileTableBody component expects the following props
 * @postcondition Renders the body of the file table
 * @param files - Array of files
 * @param currentFileIndex - Index of the currently viewed file
 * @param onFileSelect - Function to handle file selection
 * @returns rendered FileList component
 */
export const FileTableBody: React.FC<FileListProps> = ({ openModal }) => {
    const currentFileIndex = useStore((state) => state.currentFileIndex);
    const series = useStore((state) => state.series);
    const setCurrentFileIndex = useStore((state) => state.setCurrentFileIndex);
    const files = useStore((state) => state.files);

    logger.debug(
        `Rendering FileTableBody component with ${files.length} files`
    );

    return (
        <tbody>
            {files.map((file, index) => (
                <tr
                    key={index}
                    onClick={
                        !series
                            ? () => setCurrentFileIndex(index)
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
