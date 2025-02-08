import React from "react";
import { File } from "../../types/types.ts";

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
        <tbody className="pt-8">
            {files.length > 0 ? (
                files.map((file, index) => (
                    <tr key={index}>
                        <td
                            key={index}
                            className={`py-1 pl-2 cursor-pointer text-gray-300 hover:bg-blue-400 ${index === currentFileIndex
                                ? "bg-black-500 text-white bg-blue-600"
                                : ""
                                }`}
                            onClick={() => onFileSelect(index)}
                        >
                            {file.name}
                        </td>
                    </tr>
                ))
            ) : (
                <tr className="text-gray-400">
                    <td>
                        No files uploaded
                    </td>
                </tr>
            )}
        </tbody>
    );
};
