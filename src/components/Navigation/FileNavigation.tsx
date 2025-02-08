import React from "react";
import { NavButton } from "./NavButton";

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
            <NavButton
                onClick={onPrevFile}
                disabled={currentFileIndex === 0}
                label="Previous"
            />
            <NavButton
                onClick={onNextFile}
                disabled={currentFileIndex === fileCount - 1}
                label="Next"
            />
        </div>
    );
};
