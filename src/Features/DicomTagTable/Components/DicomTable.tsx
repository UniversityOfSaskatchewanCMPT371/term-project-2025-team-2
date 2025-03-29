import React, { useState } from "react";
import logger from "@logger/Logger";
import { tagUpdater } from "@dataFunctions/DicomData/TagUpdater";
import { createFile } from "@dataFunctions/DicomData/DownloadFuncs";
import { downloadDicomFile } from "@dataFunctions/DicomData/DownloadFuncs";
import { DicomTableProps } from "../Types/DicomTypes";
import { useFilteredRows } from "@hooks/useFilteredRows";
import { createRows } from "../Functions/rowUtils";
import { TableHeader } from "./TableHeader";
import { TableControls } from "./TableControls";
import { DicomTableBody } from "./DicomTableBody";

import { useStore } from "@state/Store";

/**
 * Main DICOM table component
 * @component
 * @description Main DICOM table component
 * @precondition File to be uploaded and parsed
 * @postcondition Renders the DICOM table component
 * @param {DicomTableProps} props - The component props
 * @returns {JSX.Element} The rendered DICOM table
 * @throws {Error} When no DICOM data is available
 */
const DicomTable: React.FC<DicomTableProps> = () => {
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
            add: false,
        });
    };

    /**
     * Updates and downloads the modified DICOM file
     * @returns {void}
     */
    const updateFile = () => {
        logger.debug(`Updating file: ${files[currentFileIndex].name}`);

        const currentFileName = files[currentFileIndex].name;
        const isFileEdited = newTagValues.some(
            (tag) => tag.fileName === currentFileName
        );

        logger.debug(`File edited: ${isFileEdited}`);

        const updatedDicomData = tagUpdater(
            dicomData[currentFileIndex].DicomDataSet,
            newTagValues
        );

        const blob = new Blob([updatedDicomData], {
            type: "application/dicom",
        });

        const newFile = createFile(currentFileName, blob, isFileEdited);
        downloadDicomFile(newFile);
        clearData();
    };

    logger.debug("Rendering DICOM table");

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

export default DicomTable;
