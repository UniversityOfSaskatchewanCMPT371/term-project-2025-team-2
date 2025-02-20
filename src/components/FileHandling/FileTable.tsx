import React, { useState } from "react";
import FileTableBody from "./FileTableBody.tsx";
import Modal from "../utils/Modal.tsx";
import { FileTableProps } from "../../types/FileTypes.ts";
import { DocumentIcon } from "@heroicons/react/24/outline";

/**
 * @description FileTable component - renders a table of files
 * @param files - Array of files
 * @param currentFileIndex - Index of the currently viewed file
 * @param onFileSelect - Function to handle file selection
 * @returns rendered FileTable component
 */
const FileTable: React.FC<FileTableProps> = ({
    files,
    currentFileIndex,
    onFileSelect,
    series,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (files.length === 0) {
        return (
            <div className="mt-4 rounded-lg bg-base-300/30 p-6 text-center">
                <DocumentIcon className="mx-auto size-8 text-base-content/50" />
                <p className="mt-2 text-sm text-base-content/70">
                    No files uploaded yet
                </p>
            </div>
        );
    }

    return (
        <div className="mt-2 rounded-lg bg-base-300/30 p-4">
            <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-medium text-base-content/70">
                    Uploaded Files ({files.length})
                </h4>
            </div>

            <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                <table className="w-full table-auto">
                    <FileTableBody
                        files={files}
                        currentFileIndex={currentFileIndex}
                        onFileSelect={onFileSelect}
                        series={series}
                        openModal={setIsModalOpen}
                    />
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Cannot Select File"
                text="When editing as a series, only one file can be edited at a time."
            />
        </div>
    );
};

export default FileTable;
