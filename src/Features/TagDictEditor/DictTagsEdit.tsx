import { useStore } from "@state/Store";
import { PencilSquareIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { GenButton } from "@components/utils/GenButton";
import logger from "@logger/Logger";
import { standardDataElements } from "@dataFunctions/TagDictionary/standardDataElements";

/**
 * Side panel for showing and editing tags to be anonymized
 * @component
 * @precondition SidePanel component expects the following props
 * @postcondition SidePanel component renders a side panel for showing and editing tags to be anonymized
 * @returns {JSX.Element} The rendered side panel
 */
export const DictTagsEdit = () => {
    const setShowDictEdit = useStore((state)=> state.setShowDictEdit)
    const showDictEdit = useStore((state)=>state.showDictEdit)

    const tagDictionary = useStore((state) => state.tagDictionary);
    const updateTagDictionary = useStore((state) => state.updateTagDictionary);
    const resetTagDictionary = useStore((state) => state.resetTagDictionary);
    const setShowAlert = useStore((state) => state.setShowAlert);
    const setAlertMsg = useStore((state) => state.setAlertMsg);
    const setAlertType = useStore((state) => state.setAlertType);

    const [tagId, setTagId] = useState<string>("");
    const [tagName, setTagName] = useState<string>("");
    const [tagValue, setTagValue] = useState<string>("");
    const [showAddTag, setShowAddTag] = useState<boolean>(false);

    const [reset, setReset] = useState(0); // used to force a re-render of the table

    let tagChanges: any = [];

    const addChanges = (
        tagId: string,
        newValue: string,
        deleteTag: boolean
    ) => {
        logger.debug(`Adding tag change: ${tagId} ${newValue} ${deleteTag}`);

        tagChanges.push({ tagId, newValue, deleteTag });
    };

    const addtag = (tagId: string, tagValue: string) => {
        logger.info(`Adding tag: ${tagId} ${tagValue}`);

        if (tagId.length !== 8 || isNaN(parseInt(tagId))) {
            setAlertType("alert-error");
            setAlertMsg("Tag ID has to be 8 numbers");
            setShowAlert(true);
            return;
        }
       
        if (tagName.length < 1) {
            setAlertType("alert-error");
            setAlertMsg("Tag Name can't be empty");
            setShowAlert(true);
            return;
        }

        // const temp = [...tagsToAnon];
        // temp.unshift({
        //     tagId: "X" + tagId,
        //     name: tagName,
        //     value: tagValue,
        // });

       ;
        setTagId("");
        setTagName("");
        setTagValue("");
        setShowAddTag(false);
    };

    const handleUpdateValue = () => {
        logger.debug("Updating tag values");
        setShowAddTag(false);

        // const temp = [...tagsToAnon];

        // tagChanges.forEach((change: any) => {
        //     if (change.deleteTag) {
        //         temp.splice(
        //             temp.findIndex((tag: any) => tag.tagId === change.tagId),
        //             1
        //         );
        //     } else {
        //         temp[
        //             temp.findIndex((tag: any) => tag.tagId === change.tagId)
        //         ].value = change.newValue;
        //     }
        // });

        setReset((prev) => prev + 1);
        tagChanges = [];
       

        setAlertMsg("Updates Saved");
        setAlertType("alert-success");
        setShowAlert(true);
    };

    const filterTagName = (tagId: string) => {
        const keyId = Object.keys(standardDataElements).find(
            (key) => key === tagId
        );
        if (keyId) {
            return standardDataElements[keyId].name;
        }
        return "Unknown";
    };

    return (
        <div
            className={`fixed right-0 top-0 h-full w-3/4 transform overflow-y-auto bg-base-200/95 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out 
                ${showDictEdit
                    ? "translate-x-0"
                    : "translate-x-full"
                }`}
        >
            <div className="mb-5 mr-8 mt-24 flex items-center justify-between">
                <div className="ml-4 text-xl font-bold text-blue-400">
                    Edit Tag Dictionary
                </div>
                <GenButton
                    onClick={() => {
                        setShowDictEdit(false);
                        setShowAddTag(false);
                    }}
                    label="Close"
                    disabled={false}
                />
            </div>

            <div className="mb-4 flex justify-around">
                <button
                    onClick={() => {
                        handleUpdateValue();
                    }}
                    className="rounded-full bg-success px-6 py-2.5 text-sm font-medium text-primary-content shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:bg-base-300 disabled:hover:scale-100"
                >
                    Save
                </button>
                <button
                    onClick={() => {
                        setShowAddTag(!showAddTag);
                    }}
                    className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-content shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:bg-base-300 disabled:hover:scale-100"
                >
                    {showAddTag ? "Close Add Tag" : "Add Tag"}
                </button>
                <button
                    onClick={() => {
                       setShowDictEdit(false);
                        setShowAddTag(false);
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
                        
                        setShowAddTag(false);
                        setReset((prev) => prev + 1);
                    }}
                    className="rounded-full bg-error px-6 py-2.5 text-sm font-medium text-primary-content shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:bg-base-300 disabled:hover:scale-100"
                >
                    Reset Tags
                </button>
            </div>
            <table className="m-4 mb-10 mb-24 border text-lg text-base-content">
                <thead>
                    <tr className="text-wrap bg-primary">
                        <th className="w-1/5 border px-4 py-2 text-primary-content">
                            Tag ID
                        </th>
                        <th className="w-2/5 border px-4 py-2 text-primary-content">
                            Tag Name
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-base-100">
                    {showAddTag ? (
                        <tr>
                            <td className="border px-4 py-2 text-center">
                                <div className="flex-col-2 flex">
                                    <div className="mr-2">X</div>
                                    <input
                                        type="text"
                                        className="w-full"
                                        placeholder="Tag ID"
                                        maxLength={8}
                                        onChange={(e) => {
                                            setTagId(e.target.value);
                                            setTagName(
                                                filterTagName(e.target.value)
                                            );
                                        }}
                                    />
                                </div>
                            </td>
                            <td className="border px-4 py-2 text-center">
                                <div className="flex-col-2 flex">
                                    <input
                                        type="text"
                                        className="mr-4 w-full"
                                        placeholder="Tag Value"
                                        onChange={(e) =>
                                            setTagValue(e.target.value)
                                        }
                                    />
                                    <CheckCircleIcon
                                        data-testid="CheckCircleIcon"
                                        className="h-6 w-6 cursor-pointer hover:scale-110 hover:text-success"
                                        onClick={() => addtag(tagId, tagValue)}
                                    />
                                </div>
                            </td>
                        </tr>
                    ) : null}


                    {Object.keys(standardDataElements).map((key, index) => (
                        <tr key={index}>
                            <td className="border text-center">{key}</td>
                            <td className="border">
                                <div className="flex justify-between">
                                    {standardDataElements[key].name}
                                    <div className="flex flex-col-2">
                                        <div className="flex cursor-pointer justify-end hover:text-accent">
                                            <PencilSquareIcon className="h-6 w-6"
                                                onClick={() => addChanges}
                                            />
                                        </div>
                                        <div className="flex cursor-pointer justify-end hover:text-accent">
                                            <XCircleIcon className="mx-4 h-6 w-6" />
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
