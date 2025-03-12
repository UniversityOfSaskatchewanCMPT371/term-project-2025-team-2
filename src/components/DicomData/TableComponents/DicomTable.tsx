import React, { useState } from "react";
import logger from "../../utils/Logger";
import { tagUpdater } from "../TagUpdater";
import { createFile } from "../DownloadFuncs";
import { downloadDicomFile } from "../DownloadFuncs";
import { DicomTableProps } from "../../../types/DicomTypes";
import { useFilteredRows } from "../../Hooks/useFilteredRows";
import { createRows } from "./rowUtils";
import { TableHeader } from "./TableHeader";
import { TableControls } from "./TableControls";
import { DicomTableBody } from "./DicomTableBody";

import { useStore } from "../../State/Store";

/**
 * Main DICOM table component
 * @component
 * @param {DicomTableProps} props - The component props
 * @returns {JSX.Element} The rendered DICOM table
 * @throws {Error} When no DICOM data is available
 */
export const DicomTable: React.FC<DicomTableProps> = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const files = useStore((state) => state.files);
    const dicomData = useStore((state) => state.dicomData);
    const currentFileIndex = useStore((state) => state.currentFileIndex);
    const newTagValues = useStore((state) => state.newTagValues);
    const clearData = useStore((state) => state.clearData);
    const updateTableData = useStore((state) => state.setNewTagValues);
    const showHiddenTags = useStore((state) => state.showHiddenTags);

    const fileName = files[currentFileIndex].name;

    if (Object.keys(dicomData[currentFileIndex].tags).length === 0) {
        logger.error("No DICOM data available");
        return <div>No data available</div>;
    }

    const rows = createRows(
        dicomData[currentFileIndex],
        fileName,
        newTagValues
    );
    const filteredRows = useFilteredRows(rows, searchTerm);

    /**
     * Updates a tag's value
     * @param {string} tagId - ID of the tag to update
     * @param {string} newValue - New value for the tag
     * @param {boolean} deleteTag - Whether to delete the tag
     */
    const handleUpdateValue = (
        tagId: string,
        newValue: string,
        deleteTag: boolean
    ) => {
        updateTableData({
            fileName: files[currentFileIndex].name,
            tagId,
            newValue,
            delete: deleteTag,
        });
    };

    /**
     * Updates and downloads the modified DICOM file
     * @returns {void}
     */
    const updateFile = () => {
        const currentFileName = files[currentFileIndex].name;
        const isFileEdited = newTagValues.some(
            (tag) => tag.fileName === currentFileName
        );
    
        if (!isFileEdited) {
            logger.warn(`No edits found for "${currentFileName}", skipping download.`);
            return;
        }
    
        const updatedDicomData = tagUpdater(
            dicomData[currentFileIndex].DicomDataSet,
            newTagValues
        );
        const blob = new Blob([updatedDicomData], {
            type: "application/dicom",
        });
        const newFile = createFile(currentFileName, blob);
        downloadDicomFile(newFile);
        clearData();
    };
    

    return (
        <div key={fileName} className="mt-8">
            <h2 className="text-2xl font-semibold">DICOM Tags</h2>
            <TableControls
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSave={updateFile}
            />
            <table
                className="mt-4 min-w-full table-auto border-collapse"
                style={{ tableLayout: "fixed", width: "100%" }}
            >
                <TableHeader />
                <DicomTableBody
                    filteredRows={filteredRows}
                    showHidden={showHiddenTags}
                    onUpdateValue={handleUpdateValue}
                />
            </table>
        </div>
    );
};