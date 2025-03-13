import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useStore } from "@state/Store";
import { useState } from "react";

export const NewTagRow = () => {

    const [tagId, setTagId] = useState("");
    const [tagName, setTagName] = useState("");
    const [tagValue, setTagValue] = useState("");

    const updateTableData = useStore((state) => state.setNewTagValues);

    const handleUpdateValue = (
        tagId: string,
        newValue: string,
        deleteTag: boolean
    ) => {
        updateTableData({
            fileName: "test",
            tagId,
            newValue,
            delete: deleteTag,
        });
    }
    
    return (
        <tr>
            <td  className="border px-4 py-2 text-center">
                <div className="flex flex-col-2">
                    <div className="mr-2">X</div>
                <input
                    type="text"
                    className="w-full"
                    placeholder="Tag ID"
                    onChange={(e) => setTagId(e.target.value)}
                />
                </div>
            </td>
            <td  className="border px-4 py-2 text-center">
                <input
                    type="text"
                    className="w-full"
                    placeholder="Tag Name"
                    onChange={(e) => setTagName(e.target.value)}
                />
            </td>
            <td  className="border px-4 py-2 text-center">
                <div className="flex flex-col-2">
                <input
                    type="text"     
                    className="w-full"
                    placeholder="Tag Value"
                    onChange={(e) => setTagValue(e.target.value)}
                />
                <CheckCircleIcon
                    className="h-6 w-6 hover:text-success cursor-pointer hover:scale-110"
                    onClick={() => handleUpdateValue(tagId, tagValue, false)}
                />
                </div>
            </td>
        </tr>
    )

};
