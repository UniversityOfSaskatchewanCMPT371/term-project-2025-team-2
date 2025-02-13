import React, { useState } from "react";
import { FileTableBody } from "./FileTableBody.tsx";
import Modal from "../utils/Modal.tsx";
import { FileTableProps } from "../../types/types.ts";

/**
 *
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

    return (
        <div className="mt-2">
            <table className="w-full table-auto overflow-y-auto">
                <thead className="mb-1 text-lg font-semibold text-secondary-content text-white">
                    <tr>
                        <td>Uploaded Files</td>
                    </tr>
                </thead>
                <FileTableBody
                    files={files}
                    currentFileIndex={currentFileIndex}
                    onFileSelect={onFileSelect}
                    series={series}
                    openModal={setIsModalOpen}
                />
            </table>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Can't select file"
                text="Editing as series, only one file is editable"
            />
        </div>
    );
};

export default FileTable;
