import { Search } from "../../../Components/utils/Search";
import { GenButton } from "../../../Components/utils/GenButton";
import { AnonTag, TableControlsProps } from "../Types/DicomTypes";
import { FormatData } from "../../AutoAnonymize/Functions/AutoClean";
import { useStore } from "@state/Store";
import { TagDictionary } from "../../../DataFunctions/TagDictionary/dictionary";
import { updateAllFiles } from "../../../DataFunctions/DicomData/UpdateAllFiles";

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
    const setTags = useStore((state) => state.setTags);
    const clearData = useStore((state) => state.clearData);

    const currentFileIndex = useStore((state) => state.currentFileIndex);
    const newTagValues = useStore((state) => state.newTagValues);
    const downloadOption = useStore((state) => state.downloadOption);
    const series = useStore((state) => state.series);

    const setSidePanelVisible = useStore((state) => state.setSidePanelVisible);

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
                        label={"Download All as Zip"}
                        disabled={false}
                        onClick={() => {
                            updateAllFiles(
                                dicomData,
                                series,
                                newTagValues,
                                files,
                                currentFileIndex,
                                downloadOption
                            );
                            clearData();
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
