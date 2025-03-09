/**
 * A single DICOM tag with its properties
 * @interface DicomTag
 * @property {string} tagName - The human-readable name of the DICOM tag
 * @property {(string|DicomTag[])} value - The value of the tag, which can be either a string or nested DICOM tags
 * @property {boolean} [hidden] - Optional flag indicating if the tag should be hidden in the UI
 */
export interface DicomTag {
    tagName: string;
    value: string | DicomTag[];
    hidden?: boolean;
}

/**
 * A mapping of tag IDs to their corresponding DICOM tag data
 * @property {Object.<string, DicomTag>} DicomTags
 */
export interface DicomTags {
    [tagId: string]: DicomTag;
}

/**
 * The complete DICOM dataset structure
 * @interface {Object} DicomDataSet
 * @property {DicomTags} tags - Collection of all DICOM tags in the dataset
 * @property {any} DicomDataSet - Raw DICOM dataset information
 * @todo Replace 'any' with specific type for raw DICOM data
 */
export interface DicomData {
    tags: DicomTags;
    DicomDataSet: any;
}

/**
 * A single DICOM file
 * @interface {Object} DicomDataSet
 * @property {Uint8Array} byteArray - The raw DICOM file data
 * @property {any} byteArrayParser - The parser for the raw DICOM file data
 * @property {element[]} elements - The DICOM elements in the file
 * @property {any[]} warnings - Any warnings generated during parsing
 */
export interface DicomDataSet {
    byteArray: Uint8Array;
    byteArrayParser: any;
    elements: element[];
    warnings: any[];
}

/**
 * An element in a DICOM dataset
 * @interface {Object} element
 * @property {string} tag - The DICOM tag
 * @property {string} vr - The value representation of the tag
 * @property {number} length - The length of the tag data
 * @property {number} dataOffset - The offset of the tag data
 */
interface element {
    tag: string;
    vr: string;
    length: number;
    dataOffset: number;
}

/**
 * Props for the main DicomTable component
 * @typedef {Object} DicomTableProps
 * @property {DicomDataSet} dicomData - The DICOM dataset to display
 * @property {string} fileName - Name of the current DICOM file
 * @property {function(TableUpdateData): void} updateTableData - Callback function to update table data
 * @property {Array<{fileName: string, tagId: string, newValue: string}>} newTableData - Array of modified table data
 * @property {function(): void} clearData - Function to clear all modifications
 * @property {boolean} showHiddenTags - Flag indicating if hidden tags should be shown
 */
export interface DicomTableProps {}

/**
 * A row in the DICOM table view
 * @interface {Object} TableRow
 * @property {string} tagId - Unique identifier for the DICOM tag
 * @property {string} tagName - Human-readable name of the tag
 * @property {(string|DicomTag[])} value - Current value of the tag
 * @property {boolean} hidden - Whether the tag is hidden in the UI
 * @property {boolean} updated - Whether the tag has been modified
 */
export interface TableRow {
    tagId: string;
    tagName: string;
    value: string | DicomTag[];
    hidden: boolean;
    updated: boolean;
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

/**
 * Data structure for table updates
 * @interface {Object} TableUpdateData
 * @property {string} fileName - Name of the DICOM file being updated
 * @property {string} tagId - ID of the tag being updated
 * @property {string} newValue - New value for the tag
 * @property {boolean} delete - Whether to delete the tag
 */
export interface TableUpdateData {
    fileName: string;
    tagId: string;
    newValue: string;
    delete: boolean;
}

/**
 * Props for the table controls
 * @interface {Object} TableControlsProps
 * @property {string} searchTerm - Current search term
 * @property {function(string): void} onSearchChange - Callback function for search term changes
 * @property {function(): void} onSave - Callback function to save changes
 */
export interface TableControlsProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onSave: () => void;
}

/**
 * Props for the DicomTableBody component
 * @interface {Object} DicomTableBodyProps
 * @property {Array<TableRow>} filteredRows - Filtered list of DICOM tag rows
 * @property {boolean} showHidden - Whether to show hidden tags
 * @property {function(string, string, boolean): void} onUpdateValue - Callback function to update tag values
 */
export interface DicomTableBodyProps {
    filteredRows: Array<{
        tagId: string;
        tagName: string;
        value: any;
        hidden: boolean;
        updated: boolean;
    }>;
    showHidden: boolean;
    onUpdateValue: (
        tagId: string,
        newValue: string,
        deleteTag: boolean
    ) => void;
}

/**
 * Tag data for anonymization
 * @interface {Object} AnonTag
 * @property {string} tagId - ID of the DICOM tag
 * @property {string} tagName - Human-readable name of the tag
 * @property {string} newValue - New value for the tag
 */
export interface AnonTag {
    tagId: string;
    tagName: string;
    newValue: string;
}

/**
 * Props for the AnonPopup component
 * @interface {Object} AnonPopupProps
 * @property {Array<AnonTag>} tags - List of tags to be anonymized
 * @property {function(): void} onConfirm - Callback function for confirming the anonymization
 * @property {function(): void} onCancel - Callback function for canceling the anonymization
 */
export interface AnonPopupProps {
    tags: AnonTag[];
    onConfirm: () => void;
    onCancel: () => void;
    onUpdateTag: (tagId: string, newValue: string) => void;
}
