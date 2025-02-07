import React from "react";
import { NavigationLinks } from "./NavigationLinks.tsx";
import { FileList } from "../FileHandling/FileList.tsx";
import { SidebarProps } from "../../types/types.ts";

const Sidebar: React.FC<SidebarProps> = ({
    files,
    onFileSelect,
    currentFileIndex,
}) => {
    return (
        <div className="fixed right-0 top-0 h-full w-64 bg-blue-700 p-6 text-white">
            <h3 className="mb-6 mt-20 text-xl font-semibold">Sidebar</h3>

            <NavigationLinks />

            <div className="mt-8">
                <h4 className="text-lg font-semibold">Uploaded Files</h4>
                <FileList
                    files={files}
                    currentFileIndex={currentFileIndex}
                    onFileSelect={onFileSelect}
                />
            </div>
        </div>
    );
};

export default Sidebar;
