import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useStore } from "@state/Store";
import { useState } from "react";
import logger from "@logger/Logger";

/**
 * Create New Tag Row
 * @component
 * @description Create a new tag row
 * @precondition NewTagRow component expects the following props
 * @postcondition NewTagRow component renders a new tag row
 * @returns {JSX.Element} The rendered new tag row
 */
export const NewTagRow = () => {
    const [tagId, setTagId] = useState<string>("");
    const [tagName, setTagName] = useState<string>("");
    const [tagValue, setTagValue] = useState<string>("");

    const updateTableData = useStore((state) => state.setNewTagValues);
    const setShowAlert = useStore((state) => state.setShowAlert);
    const setAlertMsg = useStore((state) => state.setAlertMsg);
    const setShowAddTag = useStore((state) => state.setShowAddTag);
    const files = useStore((state) => state.files);
    const currentFileIndex = useStore((state) => state.currentFileIndex);

    const handleUpdateValue = (
        tagId: string,
        newValue: string,
        deleteTag: boolean
    ) => {
        logger.debug(`Adding new tag with: ${tagId}, ${newValue}`);

        setShowAddTag(false);
        if (tagId.length !== 8 || isNaN(parseInt(tagId))) {
            logger.debug(`New tag ID is not 8 numbers: ${tagId}`);
            setAlertMsg("Tag ID has to be 8 numbers");
            setShowAlert(true);
        }
        if (tagValue.length < 1) {
            logger.debug("New tag value is empty");
            setAlertMsg("Tag Value can't be empty");
            setShowAlert(true);
        }
        if (tagName.length < 1) {
            logger.debug("New tag name is empty");
            setAlertMsg("Tag Name can't be empty");
            setShowAlert(true);
        }

        updateTableData({
            fileName: files[currentFileIndex].name,
            tagId: "X" + tagId,
            newValue,
            delete: deleteTag,
            add: true,
        });

        setTagId("");
        setTagName("");
        setTagValue("");
        setShowAddTag(false);
    };

    logger.debug("Rendering NewTagRow component");

    return (
        <tr>
            <td className="border px-4 py-2 text-center">
                <div className="flex-col-2 flex">
                    <div className="mr-2">X</div>
                    <input
                        type="text"
                        className="w-full"
                        placeholder="Tag ID"
                        onChange={(e) => setTagId(e.target.value)}
                    />
                </div>
            </td>
            <td className="border px-4 py-2 text-center">
                <input
                    type="text"
                    className="w-full"
                    placeholder="Tag Name"
                    onChange={(e) => setTagName(e.target.value)}
                />
            </td>
            <td className="border px-4 py-2 text-center">
                <div className="flex-col-2 flex">
                    <input
                        type="text"
                        className="mr-4 w-full"
                        placeholder="Tag Value"
                        onChange={(e) => setTagValue(e.target.value)}
                    />
                    <CheckCircleIcon
                        data-testid="CheckCircleIcon"
                        className="h-6 w-6 cursor-pointer text-gray-500 hover:scale-110 hover:text-success"
                        onClick={() =>
                            handleUpdateValue(tagId, tagValue, false)
                        }
                    />
                </div>
            </td>
        </tr>
    );
};
