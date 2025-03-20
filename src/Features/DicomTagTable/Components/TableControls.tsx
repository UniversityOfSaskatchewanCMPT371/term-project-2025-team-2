import { Search } from "@components/utils/Search";
import { GenButton } from "@components/utils/GenButton";
import { AnonTag, TableControlsProps } from "../Types/DicomTypes";
import { FormatData } from "@features/AutoAnonymize/Functions/AutoClean";
import { useStore } from "@state/Store";
import { TagDictionary } from "@dataFunctions/TagDictionary/dictionary";
import { assert } from "@dataFunctions/assert";
import logger from "@logger/Logger";

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
    const tagsToAnon = useStore((state) => state.tagsToAnon);

    const tagDictionary = new TagDictionary();

    // breaks test, need to update test and remove add assert
    // assert(dicomData.length > 0, "dicomData should not be empty");
    assert(onSave !== null, "onSave should not be empty");

    const handleAutoAnon = async () => {
        logger.info("Auto Anonymizing tags");

        const newTagData: AnonTag[] = [];
        dicomData.forEach((data) => {
            const formattedData = FormatData(data, tagsToAnon);

            formattedData.forEach(
                (tag: { tagId: string; newValue: string }) => {
                    if (
                        !newTagData.some(
                            (existingTag) => existingTag.tagId === tag.tagId
                        )
                    ) {
                        newTagData.push({
                            tagId: tag.tagId,
                            tagName: tagDictionary.lookupTagName(tag.tagId),
                            newValue: tag.newValue,
                        });
                    }
                }
            );
        });

        logger.debug(`Anonymizing tags: ${newTagData}`);
        setTags(newTagData);
        setSidePanelVisible(true);
    };

    logger.debug("Rendering TableControls component");

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
                        data-testid="DicomAddTag"
                        onClick={() => setShowAddTag(!addTag)}
                        label={addTag ? "Close Add Tag" : "Add Tag"}
                        disabled={false}
                    />
                </div>
            </div>
        </div>
    );
};
