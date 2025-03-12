import React from "react";
import { DicomTableRow } from "./DicomTableRow";
import EmptyTableRow from "./EmptyTableRow";
import { DicomTableBodyProps } from "../Types/DicomTypes";

/**
 * DICOM table body component
 * @component
 * @description Body of the DICOM table
 * @precondition DicomTableBody component expects the following props
 * @precondition filteredRows - Filtered list of DICOM tag rows
 * @param {DicomTableBodyProps} props
 * @param {Array<TableRow>} props.filteredRows - Filtered list of DICOM tag rows
 * @param {boolean} props.showHidden - Whether to show hidden tags
 * @param {function(string, string, boolean): void} props.onUpdateValue - Callback function to update tag values
 * @returns {React.FunctionComponent}
 */
export const DicomTableBody: React.FC<DicomTableBodyProps> = ({
    filteredRows,
    showHidden,
    onUpdateValue,
}) => (
    <tbody>
        {filteredRows.length > 0 ? (
            filteredRows.map((row, index) =>
                row.hidden && !showHidden ? null : (
                    <DicomTableRow
                        key={index + row.tagId}
                        row={row}
                        index={index}
                        onUpdateValue={onUpdateValue}
                        updated={row.updated}
                    />
                )
            )
        ) : (
            <EmptyTableRow />
        )}
    </tbody>
);
