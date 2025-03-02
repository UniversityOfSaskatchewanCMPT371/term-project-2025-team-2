import React from "react";
import Search from "../../utils/Search";
import { GenButton } from "../../utils/GenButton";
import { TableControlsProps } from "../../../types/DicomTypes";
import { AutoAnon } from "../../Auto/AutoClean";
import { useStore } from "../../State/Store";
/**
 * Controls component for the DICOM table
 * @component
 * @param {Object} props - The component props
 * @param {string} props.searchTerm - Current search term
 * @param {function(string): void} props.onSearchChange - Callback for search term changes
 * @param {function(): void} props.onSave - Callback for save action
 * @param {function(): void} props.onToggleHidden - Callback for toggling hidden tags
 * @param {boolean} props.showHidden - Whether hidden tags are currently shown
 * @returns {JSX.Element} The rendered controls section
 */
const TableControls: React.FC<TableControlsProps> = ({
    searchTerm,
    onSearchChange,
    onSave,
}) => {
    const dicomData = useStore((state) => state.dicomData);
    const files = useStore((state) => state.files);
    const clearData = useStore((state) => state.clearData);

    return (
        <div className="flex-col-2 flex">
            <Search searchTerm={searchTerm} onSearchChange={onSearchChange} />
            <div className="flex-col-2 ml-4 flex">
                <div>
                    <GenButton
                        label="Download File"
                        disabled={false}
                        onClick={onSave}
                    />
                </div>

                <div className="ml-4">
                    <GenButton
                        onClick={() => {
                            AutoAnon(dicomData, files);
                            clearData();
                        }}
                        label="Auto Anon"
                        disabled={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default TableControls;
