import React from "react";
import { FileTableBody } from "./FileTableBody.tsx";

/**
 * interface FileTableProps
 */
interface FileTableProps {
    files: any[];
    currentFileIndex: number;
    onFileSelect: (index: number) => void;
}

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
}) => {
    return (
        <div className="mt-8">
            <table className="w-full table-auto overflow-y-auto">
                <thead className="mb-1 text-lg font-semibold text-secondary-content">
                    <tr>
                        <td>Uploaded Files</td>
                    </tr>
                </thead>
                <FileTableBody
                    files={files}
                    currentFileIndex={currentFileIndex}
                    onFileSelect={onFileSelect}
                />
            </table>
        </div>
    );
};

export default FileTable;
