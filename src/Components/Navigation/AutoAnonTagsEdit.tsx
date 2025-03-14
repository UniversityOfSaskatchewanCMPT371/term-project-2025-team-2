import { useStore } from "@state/Store";
import { DicomTableRow } from "../../Features/DicomTagTable/Components/DicomTableRow";
import { TagsAnon } from "@auto/Functions/TagsAnon";

/**
 * Side panel for showing and editing tags to be anonymized
 * @component
 * @precondition SidePanel component expects the following props
 * @postcondition SidePanel component renders a side panel for showing and editing tags to be anonymized
 * @returns {JSX.Element} The rendered side panel
 */
export const AutoAnonTagsEdit = () => {
    const autoAnonTagsEditPanelVisible = useStore(
        (state) => state.autoAnonTagsEditPanelVisible
    );
    const setAutoAnonTagsEditPanelVisible = useStore(
        (state) => state.setAutoAnonTagsEditPanelVisible
    );

    const tagsToAnon = useStore((state) => state.tagsToAnon);
    const setTagsToAnon = useStore((state) => state.setTagsToAnon);

    const handleUpdateValue = (tagId: string, newValue: string, deleteTag: boolean) => {
       console.log(tagId, newValue, deleteTag);
       setTagsToAnon((prevTags) => {
           const newTags = prevTags.map((tag) => {
               if (tag.tagId === tagId) {
                   return { ...tag, value: newValue };
               }
               return tag;
           });
           return newTags;
       });
    };

    return (
        <div
            className={`fixed right-0 top-0 h-full w-3/4 transform overflow-y-auto bg-base-200/95 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out ${
                autoAnonTagsEditPanelVisible ? "translate-x-0" : "translate-x-full"
            }`}
        >
            <div className="mb-5 ml-4 mt-24 text-xl font-bold text-blue-400">
                Tags in Anonymize List
            </div>

            <div className="mb-4 flex justify-around">
                <button
                    onClick={() => setAutoAnonTagsEditPanelVisible(false)}
                    className="rounded-full bg-success px-6 py-2.5 text-sm font-medium text-primary-content shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:bg-base-300 disabled:hover:scale-100"
                >
                    Save
                </button>
                <button
                    onClick={() => setAutoAnonTagsEditPanelVisible(false)}
                    className="rounded-full bg-error px-6 py-2.5 text-sm font-medium text-primary-content shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:bg-base-300 disabled:hover:scale-100"
                >
                    Cancel
                </button>
            </div>
            <table className="m-4 mb-10 border bg-white text-lg text-gray-500 mb-24">
                <thead>
                    <tr className="text-wrap bg-primary">
                        <th className="w-1/5 border px-4 py-2 text-primary-content">
                            Tag ID
                        </th>
                        <th className="w-1/4 border px-4 py-2 text-primary-content">
                            Tag Name
                        </th>
                        <th className="w-7/12 border px-4 py-2 text-primary-content">
                            New Value
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {TagsAnon.map((tag, index) => (
                        <DicomTableRow
                            key={index + tag.tagId}
                            row={{
                                tagId: tag.tagId,
                                tagName: tag.name,
                                value: tag.value,
                            }}
                            index={index}
                            nested={false}
                            onUpdateValue={handleUpdateValue}
                            updated={false}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
