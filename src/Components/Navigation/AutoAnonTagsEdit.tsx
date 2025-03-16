import { useStore } from "@state/Store";
import { DicomTableRow } from "@features/DicomTagTable/Components/DicomTableRow";
import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { GenButton } from "@components/utils/GenButton";
import logger from "../../Logger/Logger";

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
    const setShowAlert = useStore((state) => state.setShowAlert);
    const setAlertMsg = useStore((state) => state.setAlertMsg);
    const setAlertType = useStore((state) => state.setAlterType);

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

    const addtag = (tagId: string, tagName: string, tagValue: string) => {
        logger.info(`Adding tag: ${tagId} ${tagName} ${tagValue}`);

        if (tagId.length !== 8 || isNaN(parseInt(tagId))) {
            setAlertType("alert-error");
            setAlertMsg("Tag ID has to be 8 numbers");
            setShowAlert(true);
            return;
        }
        if (tagValue.length < 1) {
            setAlertType("alert-error");
            setAlertMsg("Tag Value can't be empty");
            setShowAlert(true);
            return;
        }
        if (tagName.length < 1) {
            setAlertType("alert-error");
            setAlertMsg("Tag Name can't be empty");
            setShowAlert(true);
            return;
        }

        const temp = [...tagsToAnon];
        temp.unshift({
            tagId: "X" + tagId,
            name: tagName,
            value: tagValue,
        });

        setTagsToAnon(temp);
        setTagId("");
        setTagName("");
        setTagValue("");
        setShowAddTag(false);
    };

    const handleUpdateValue = () => {
        logger.debug("Updating tag values");
        setShowAddTag(false);

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

        setAlertMsg("Updates Saved");
        setAlertType("alert-success");
        setShowAlert(true);
    };

    return (
        <div
            className={`fixed right-0 top-0 h-full w-3/4 transform overflow-y-auto bg-base-200/95 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out ${
                autoAnonTagsEditPanelVisible
                    ? "translate-x-0"
                    : "translate-x-full"
            }`}
        >
            <div className="mb-5 mr-8 mt-24 flex items-center justify-between">
                <div className="ml-4 text-xl font-bold text-blue-400">
                    Tags in Anonymize List
                </div>
                <GenButton
                    onClick={() => {
                        setAutoAnonTagsEditPanelVisible(false);
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
                        <th className="w-7/12 border px-4 py-2 text-primary-content">
                            New Value
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
                                        onChange={(e) =>
                                            setTagId(e.target.value)
                                        }
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
                                        onChange={(e) =>
                                            setTagValue(e.target.value)
                                        }
                                    />
                                    <CheckCircleIcon
                                        data-testid="CheckCircleIcon"
                                        className="h-6 w-6 cursor-pointer hover:scale-110 hover:text-success"
                                        onClick={() =>
                                            addtag(tagId, tagName, tagValue)
                                        }
                                    />
                                </div>
                            </td>
                        </tr>
                    ) : null}

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
