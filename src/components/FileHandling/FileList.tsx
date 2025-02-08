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
                            className={`cursor-pointer py-1 pl-4 text-secondary-content hover:text-accent hover:outline ${
                                index === currentFileIndex
                                    ? "font-semibold text-accent"
                                    : ""
                            }`}
                            onClick={() => onFileSelect(index)}
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
    );
};
