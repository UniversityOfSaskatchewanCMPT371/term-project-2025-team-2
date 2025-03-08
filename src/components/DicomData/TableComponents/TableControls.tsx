import { Search } from "../../utils/Search";
import { GenButton } from "../../utils/GenButton";
import { AnonTag, TableControlsProps } from "../../../types/DicomTypes";
import { AutoAnon, FormatData } from "../../Auto/AutoClean";
import { useStore } from "../../State/Store";
import { AnonPopup } from "./AnonPopup";
import { TagDictionary } from "../../../tagDictionary/dictionary";

/**
 * Controls component for the DICOM table
 * @component
 * @param {Object} props - The component props
 * @param {string} props.searchTerm - Current search term
 * @param {function(string): void} props.onSearchChange - Callback for search term changes
 * @param {function(): void} props.onSave - Callback for save action
 * @param {function(): void} props.onToggleHidden - Callback for toggling hidden tags
 * @param {boolean} props.showHidden - Whether hidden tags are currently shown
 * @precondition dicomData and files should not be empty
 * @returns {JSX.Element} The rendered controls section
 */
export const TableControls: React.FC<TableControlsProps> = ({
    searchTerm,
    onSearchChange,
    onSave,
}) => {
    const dicomData = useStore((state) => state.dicomData);
    const files = useStore((state) => state.files);
    const anonTags = useStore((state) => state.tags);
    const setTags = useStore((state) => state.setTags);
    const clearData = useStore((state) => state.clearData);
    const showPopup = useStore((state) => state.showPopup);
    const setShowPopup = useStore((state) => state.setShowPopup);

    const tagDictionary = new TagDictionary();

    console.assert(dicomData.length > 0, "dicomData should not be empty");
    console.assert(files.length > 0, "files should not be empty");

    const handleAutoAnon = async () => {
        // format anon tags and show them
        const newTagData: AnonTag[] = FormatData(dicomData[0]).map(
            (tag: { tagId: string; tagName: string; newValue: string }) => ({
                tagId: tag.tagId,
                tagName: tagDictionary.lookupTagName(tag.tagId),
                newValue: tag.newValue,
            })
        );
        setTags(newTagData);
        setShowPopup(true);
    };

    const handleUpdateTag = (tagId: string, newValue: string) => {
        // update tags after user input
        const updatedTags = anonTags.map((tag: AnonTag) =>
            tag.tagId === tagId ? { ...tag, newValue } : tag
        );
        setTags(updatedTags);
    };

    const handleConfirm = async () => {
        // anonymize tags
        await AutoAnon(dicomData, files, anonTags);
        setShowPopup(false);
        clearData();
    };

    const handleCancel = () => {
        setShowPopup(false);
    };

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
                        onClick={handleAutoAnon}
                        label="Auto Anon"
                        disabled={false}
                    />
                </div>
            </div>
            {showPopup && (
                <AnonPopup
                    tags={anonTags}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    onUpdateTag={handleUpdateTag}
                />
            )}
        </div>
    );
};
