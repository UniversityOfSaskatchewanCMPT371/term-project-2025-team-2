import React, { useState } from "react";
import logger from "../../utils/Logger";
import { tagUpdater } from "../TagUpdater";
import { createFile } from "../DownloadFuncs";
import { downloadDicomFile } from "../DownloadFuncs";
import { DicomTableProps } from "../../../types/DicomTypes";
import { useFilteredRows } from "../../Hooks/useFilteredRows";
import { createRows } from "./rowUtils";
import TableHeader from "./TableHeader";
import TableControls from "./TableControls";
import DicomTableBody from "./DicomTableBody";

/**
 * Main DICOM table component
 * @component
 * @param {DicomTableProps} props - The component props
 * @returns {JSX.Element} The rendered DICOM table
 * @throws {Error} When no DICOM data is available
 */
const DicomTable: React.FC<DicomTableProps> = ({
    dicomData,
    fileName,
    updateTableData,
    newTableData,
    clearData,
    showHiddenTags,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    //const [showHidden, setShowHidden] = useState(false);

    if (Object.keys(dicomData).length === 0) {
        logger.error("No DICOM data available");
        return <div>No data available</div>;
    }

    const rows = createRows(dicomData, fileName, newTableData);
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
            fileName,
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
        const updatedDicomData = tagUpdater(
            dicomData.DicomDataSet,
            newTableData
        );
        const blob = new Blob([updatedDicomData], {
            type: "application/dicom",
        });
        const newFile = createFile(fileName, blob);
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

export default DicomTable;
