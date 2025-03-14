import { Search } from "../../../Components/utils/Search";
import { GenButton } from "../../../Components/utils/GenButton";
import { AnonTag, TableControlsProps } from "../Types/DicomTypes";
import { FormatData } from "../../AutoAnonymize/Functions/AutoClean";
import { useStore } from "@state/Store";
import { TagDictionary } from "../../../DataFunctions/TagDictionary/dictionary";
import { assert } from "../../../DataFunctions/assert";

/**
 * Controls component for the DICOM table
 * @component
 * @description Controls component for the DICOM table
 * @precondition dicomData and files should not be empty
 * @postcondition Renders the controls section
 * @param {Object} props - The component props
 * @param {string} props.searchTerm - Current search term
 * @param {function(string): void} props.onSearchChange - Callback for search term changes
 * @param {function(): void} props.onSave - Callback for save action
 * @returns {JSX.Element} The rendered controls section
 */
export const TableControls: React.FC<TableControlsProps> = ({
    searchTerm,
    onSearchChange,
    onSave,
}) => {
    const dicomData = useStore((state) => state.dicomData);
    const setTags = useStore((state) => state.setTags);
    const addTag = useStore((state) => state.addTag);
    const setShowAddTag = useStore((state) => state.setShowAddTag);

    const setSidePanelVisible = useStore((state) => state.setSidePanelVisible);

    const tagDictionary = new TagDictionary();

    // assert(dicomData.length > 0, "dicomData should not be empty");
    assert(onSave !== null, "onSave should not be empty");

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
        setSidePanelVisible(true);
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

                <div className="ml-4">
                    <GenButton
                        onClick={() => setShowAddTag(!addTag)}
                        label="Add Tag"
                        disabled={false}
                    />
                </div>
            </div>
        </div>
    );
};
