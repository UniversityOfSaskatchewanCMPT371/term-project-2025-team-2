import React from "react";
import { FileList } from "../FileHandling/FileList.tsx";

interface FileTableProps {
    files: any[];
    currentFileIndex: number;
    onFileSelect: (index: number) => void;
}

const FileTable: React.FC<FileTableProps> = ({
    files,
    currentFileIndex,
    onFileSelect,
}) => {
    return (
        <div className="mt-8">
            <table className="table-auto w-full">
                <thead className="mb-1 text-lg font-semibold">
                    <tr>
                        <td>Uploaded Files</td>
                    </tr>
                </thead>
                <FileList
                    files={files}
                    currentFileIndex={currentFileIndex}
                    onFileSelect={onFileSelect}
                />
            </table>
        </div>
    );
};

export default FileTable;
