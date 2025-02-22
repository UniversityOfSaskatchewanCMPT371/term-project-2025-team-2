/**
 * interface DicomTag
 * @property tagName - Name of the DICOM tag
 * @property value - Value of the DICOM tag
 * @returns DicomTag
 */
export interface DicomTag {
    tagName: string;
    value: string | DicomTag[];
    hidden?: boolean;
}

/**
 * interface DicomTableProps
 * @property dicomData - DICOM data
 * @returns DicomTableProps
 * @description - Interface for the DicomTable component
 */
export interface DicomTableProps {
    dicomData: { [key: string]: { [key: string]: DicomTag } };
    fileName: string;
    updateTableData: (data: any) => void;
    newTableData: any[];
    clearData: () => void;
}

/**
 * interface DicomTableRowProps
 * @property row - DICOM tag row
 * @property index - Index of the row
 * @property onUpdateValue - Function to update the value of the row
 * @property nested - Boolean to check if the row is nested
 * @property updated - Boolean to check if the row has been updated
 * @property level - Nesting level of the row
 */
export interface DicomTableRowProps {
    row: {
        tagId: string;
        tagName: string;
        value: string | { [tags: string]: DicomTag };
    };
    index: number;
    onUpdateValue: (
        tagId: string,
        newValue: string,
        deleteTag: boolean
    ) => void;
    nested?: boolean;
    updated?: boolean;
    level?: number;
}
