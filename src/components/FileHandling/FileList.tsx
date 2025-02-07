import React from "react";
import { File } from "../types.ts";

interface FileListProps {
    files: File[];
    currentFileIndex: number;
    onFileSelect: (index: number) => void;
}

export const FileList: React.FC<FileListProps> = ({
    files,
    currentFileIndex,
    onFileSelect,
}) => {
    return (
        <ul className="mt-4">
            {files.length > 0 ? (
                files.map((file, index) => (
                    <li
                        key={index}
                        className={`cursor-pointer text-gray-300 hover:text-blue-400 ${
                            index === currentFileIndex
                                ? "bg-black-500 text-white"
                                : ""
                        }`}
                        onClick={() => onFileSelect(index)}
                    >
                        {file.name}
                    </li>
                ))
            ) : (
                <li className="text-gray-400">No files uploaded</li>
            )}
        </ul>
    );
};
