import React from "react";

interface FileNavigationProps {
    currentFileIndex: number;
    fileCount: number;
    onPrevFile: () => void;
    onNextFile: () => void;
}

export const FileNavigation: React.FC<FileNavigationProps> = ({
    currentFileIndex,
    fileCount,
    onPrevFile,
    onNextFile,
}) => {
    return (
        <div className="mt-4 flex justify-between">
            <button
                onClick={onPrevFile}
                disabled={currentFileIndex === 0}
                className="rounded bg-secondary px-4 py-2 text-base-content hover:bg-accent disabled:bg-base-300"
            >
                Previous
            </button>
            <button
                onClick={onNextFile}
                disabled={currentFileIndex === fileCount - 1}
                className="rounded bg-secondary px-4 py-2 text-base-content hover:bg-accent disabled:bg-base-300"
            >
                Next
            </button>
        </div>
    );
};
