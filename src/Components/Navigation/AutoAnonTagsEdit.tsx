import { useStore } from "@state/Store";
import { DicomTableRow } from "@features/DicomTagTable/Components/DicomTableRow";
import { useState } from "react";
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
    const resetTagsAnon = useStore((state) => state.resetTagsAnon);

    let tagChanges: any = [];
    const [reset, setReset] = useState(0);

    const addChanges = (
        tagId: string,
        newValue: string,
        deleteTag: boolean
    ) => {
        tagChanges.push({ tagId, newValue, deleteTag });
    };

    const handleUpdateValue = () => {
        const temp = [...tagsToAnon];

        tagChanges.forEach((change: any) => {
            if (change.deleteTag) {
                temp.splice(
                    temp.findIndex((tag: any) => tag.tagId === change.tagId),
                    1
                );
            } else {
                temp[
                    temp.findIndex((tag: any) => tag.tagId === change.tagId)
                ].value = change.newValue;
            }
        });

        setReset((prev) => prev + 1);
        tagChanges = [];
        setTagsToAnon(temp);
    };

    return (
        <div
            className={`fixed right-0 top-0 h-full w-3/4 transform overflow-y-auto bg-base-200/95 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out ${
                autoAnonTagsEditPanelVisible
                    ? "translate-x-0"
                    : "translate-x-full"
            }`}
        >
            <div className="mb-5 ml-4 mt-24 text-xl font-bold text-blue-400">
                Tags in Anonymize List
            </div>

            <div className="mb-4 flex justify-around">
                <button
                    onClick={() => {
                        setAutoAnonTagsEditPanelVisible(false);
                        handleUpdateValue();
                    }}
                    className="rounded-full bg-success px-6 py-2.5 text-sm font-medium text-primary-content shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:bg-base-300 disabled:hover:scale-100"
                >
                    Save
                </button>
                <button
                    onClick={() => {
                        setAutoAnonTagsEditPanelVisible(false);
                        tagChanges = [];
                        setReset((prev) => prev + 1);
                    }}
                    className="rounded-full bg-error px-6 py-2.5 text-sm font-medium text-primary-content shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:bg-base-300 disabled:hover:scale-100"
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        tagChanges = [];
                        resetTagsAnon();
                        setReset((prev) => prev + 1);
                    }}
                    className="rounded-full bg-error px-6 py-2.5 text-sm font-medium text-primary-content shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:bg-base-300 disabled:hover:scale-100"
                >
                    Reset Tags
                </button>
            </div>
            <table className="m-4 mb-10 mb-24 border bg-white text-lg text-gray-500">
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
                    {tagsToAnon.length > 0
                        ? tagsToAnon.map((tag, index) => (
                              <DicomTableRow
                                  key={index + tag.tagId + reset}
                                  row={{
                                      tagId: tag.tagId,
                                      tagName: tag.name,
                                      value: tag.value,
                                  }}
                                  index={index + reset}
                                  nested={false}
                                  onUpdateValue={addChanges}
                                  updated={false}
                              />
                          ))
                        : null}
                </tbody>
            </table>
        </div>
    );
};
