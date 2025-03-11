import { AnonPopupProps } from "../../../types/DicomTypes";
import { useStore } from "../../State/Store";

/**
 * Confirmation popup for auto anonymized tags
 * @param {AnonPopupProps} props - Component props
 * @postcondition edited tag should not change to different tag (tagId)
 * @returns {JSX.Element} Popup box with list of tags to be anonymized
 */
export const AnonPopup: React.FC<AnonPopupProps> = ({
    tags,
    onConfirm,
    onCancel,
    onUpdateTag,
}) => {
    const editingTagId = useStore((state) => state.editingTagId);
    const setEditingTagId = useStore((state) => state.setEditingTagId);

    const handleInputChange = (
        tagId: string,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        onUpdateTag(tagId, event.target.value);
    };

    const handleTagClick = (tagId: string) => {
        setEditingTagId(tagId);
    };

    const handleBlur = () => {
        setEditingTagId(null);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleBlur();
        }
    };

    return (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
            <div className="max-h-full w-11/12 max-w-lg overflow-y-auto rounded-lg bg-white p-5 text-center shadow-lg">
                <h2 className="mb-5 text-xl font-bold text-blue-400">
                    Tags to be Anonymized
                </h2>
                <ul className="mb-5 list-none p-0">
                    {tags.map((tag, index) => (
                        <li key={index} className="mb-2 text-lg text-gray-500">
                            <strong>
                                {tag.tagId} ({tag.tagName})
                            </strong>
                            :
                            {editingTagId === tag.tagId ? (
                                <input
                                    type="text"
                                    value={tag.newValue}
                                    onChange={(event) =>
                                        handleInputChange(tag.tagId, event)
                                    }
                                    onBlur={handleBlur}
                                    onKeyDown={handleKeyDown}
                                    className="ml-2 rounded border p-1"
                                    style={{
                                        backgroundColor: "#f0f0f0",
                                        color: "#333",
                                        borderColor: "#ccc",
                                    }}
                                    autoFocus
                                />
                            ) : (
                                <span
                                    className="ml-2 cursor-pointer rounded border p-1"
                                    onClick={() => handleTagClick(tag.tagId)}
                                >
                                    {tag.newValue}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
                <div className="flex justify-around">
                    <button className="btn btn-primary" onClick={onConfirm}>
                        OK
                    </button>
                    <button className="btn btn-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
