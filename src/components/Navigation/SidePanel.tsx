import { useStore } from "@components/State/Store";
import { DicomTableRow } from "@components/DicomData/TableComponents/DicomTableRow";

export const SidePanel = () => {
    const setSidePanelVisible = useStore((state) => state.setSidePanelVisible);
    const sidePanelVisible = useStore((state) => state.sidePanelVisible);
    const tags = useStore((state) => state.tags);
    const updateTableData = useStore((state) => state.setNewTagValues);
    const files = useStore((state) => state.files);
    const currentFileIndex = useStore((state) => state.currentFileIndex);

    const handleUpdateValue = (
        tagId: string,
        newValue: string,
        deleteTag: boolean
    ) => {
        updateTableData({
            fileName: files[currentFileIndex].name,
            tagId,
            newValue,
            delete: deleteTag,
        });
    };

    return (
        <div
            className={`fixed right-0 top-0 h-full w-3/4 transform overflow-y-auto bg-base-200/95 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out ${
                sidePanelVisible ? "translate-x-0" : "translate-x-full"
            }`}
        >
            <div className="mb-5 ml-4 mt-24 text-xl font-bold text-blue-400">
                Tags to be Anonymized
            </div>

            <div className="mb-4 flex justify-around">
                <button
                    onClick={() => null}
                    className="rounded-full bg-success px-6 py-2.5 text-sm font-medium text-primary-content shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:bg-base-300 disabled:hover:scale-100"
                >
                    OK
                </button>
                <button
                    onClick={() => setSidePanelVisible(false)}
                    className="rounded-full bg-error px-6 py-2.5 text-sm font-medium text-primary-content shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:bg-base-300 disabled:hover:scale-100"
                >
                    Cancel
                </button>
            </div>
            <table className="m-4 mb-2 border bg-white text-lg text-gray-500">
                <thead>
                    <tr className="text-wrap bg-primary">
                        <th className="w-1/4 border px-4 py-2 text-primary-content">
                            Tag Name
                        </th>
                        <th className="w-7/12 border px-4 py-2 text-primary-content">
                            New Value
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tags.map((tag, index) => (
                        <DicomTableRow
                            key={index + tag.tagId}
                            row={{
                                tagId: tag.tagId,
                                tagName: tag.tagName,
                                value: tag.newValue,
                            }}
                            index={index}
                            onUpdateValue={handleUpdateValue}
                            updated={false}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
