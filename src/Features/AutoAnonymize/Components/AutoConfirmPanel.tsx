import { useStore } from "@state/Store";
import { DicomTableRow } from "@features/DicomTagTable/Components/DicomTableRow";
import { AutoAnon } from "@auto/Functions/AutoClean";
import { useState } from "react";
import { DicomTag } from "@dicom//Types/DicomTypes";
import logger from "@logger/Logger";
import { PIIResultsTable } from "./PIIResultsTable";
import { findPII } from "@auto/Functions/PIIDetection";

/**
 * Side panel for showing and editing tags to be anonymized
 * @component
 * @precondition SidePanel component expects the following props
 * @postcondition SidePanel component renders a side panel for showing and editing tags to be anonymized
 * @returns {JSX.Element} The rendered side panel
 */
export const SidePanel = () => {
    const setSidePanelVisible = useStore((state) => state.setSidePanelVisible);
    const sidePanelVisible = useStore((state) => state.sidePanelVisible);
    const tags = useStore((state) => state.tags);
    const files = useStore((state) => state.files);
    const setTags = useStore((state) => state.setTags);
    const dicomData = useStore((state) => state.dicomData);
    const clearData = useStore((state) => state.clearData);
    const tagsToAnon = useStore((state) => state.tagsToAnon);
    const setLoading = useStore((state) => state.setLoading);
    const setLoadingMsg = useStore((state) => state.setLoadingMsg);
    const setNewTagValues = useStore((state) => state.setNewTagValues);

    const [reset, setReset] = useState<number>(0);

    const fileStructure = useStore((state) => state.fileStructure);

    /**
     * Updates a tag's value or removes it from the tags array
     * @function
     * @param {string} tagId - The ID of the tag to update or delete
     * @param {string} newValue - The new value to set for the tag
     * @param {boolean} deleteTag - Flag indicating if the tag should be deleted
     * @precondition The tags state must be initialized as an array
     * @postcondition If deleteTag is true, tag with matching tagId is removed from tags array
     *                If tag exists, its value is updated; otherwise a new tag is added to the array
     * @returns {void}
     */
    const handleUpdateValue = (
        tagId: string,
        newValue: string,
        deleteTag: boolean
    ) => {
        if (deleteTag) {
            logger.debug(`Deleting tag with tagId: ${tagId}`);

            setTags(tags.filter((tag) => tag.tagId !== tagId));
            return;
        }
        const temp = tags.some((tag) => tag.tagId === tagId)
            ? tags.map((tag) => {
                  if (tag.tagId === tagId) {
                      return { ...tag, newValue };
                  }
                  return tag;
              })
            : [...tags, { tagId, tagName: "", newValue }];

        setTags(temp);
    };

    /**
     * Executes the auto-anonymization process on the loaded DICOM files
     * @function
     * @precondition Files must be loaded, tags to anonymize must be defined
     * @postcondition Files are anonymized according to specified tags, UI state is reset,
     *                side panel is closed, and all temporary data is cleared
     * @returns {Promise<void>} A promise that resolves when anonymization is complete
     */
    const handleAutoAnon = async () => {
        logger.debug("Auto Anonymizing tags");

        setLoading(true);
        setLoadingMsg("Anonymizing tags...");

        await new Promise((resolve) => setTimeout(resolve, 0));

        await AutoAnon(dicomData, files, tags, tagsToAnon, fileStructure);

        clearData();
        setSidePanelVisible(false);
        setFoundPII(false);
        setPII([]);
        setReset((prev) => prev++);
        setTags([]);
    };

    /**
     * Displays the anonymized tags on the loaded files without actually applying changes
     * @function
     * @precondition Files must be loaded and tags to anonymize must be defined
     * @postcondition Tags with their new values are shown on files via the store,
     *                side panel is closed, and temporary states are reset
     * @returns {Promise<void>} A promise that resolves when the preview is complete
     */
    const showUpdates = async () => {
        logger.debug("SHow On Files - Auto Anonymize tags");

        setLoading(true);
        setLoadingMsg("Showing anonymized tags on files...");

        await new Promise((resolve) => setTimeout(resolve, 0));

        files.forEach((file, index) => {
            tags.forEach((tag) => {
                if (dicomData[index].tags[tag.tagId] !== undefined) {
                    const updatedTag = {
                        fileName: file.name,
                        tagId: tag.tagId,
                        newValue: tag.newValue,
                        add: false,
                        delete: false,
                    };
                    setNewTagValues(updatedTag);
                }
            });
        });

        setLoading(false);
        setSidePanelVisible(false);
        setFoundPII(false);
        setPII([]);
    };

    const [PII, setPII] = useState<DicomTag[]>([]);
    const [foundPII, setFoundPII] = useState(false);

    const setShowAlert = useStore((state) => state.setShowAlert);
    const setAlertMsg = useStore((state) => state.setAlertMsg);
    const setAlertType = useStore((state) => state.setAlertType);

    logger.info("Rendering AutoConfirmPanel component");

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
                    onClick={() => {
                        handleAutoAnon();
                    }}
                    className="rounded-full bg-success px-6 py-2.5 text-sm font-medium text-primary-content shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:bg-base-300 disabled:hover:scale-100"
                >
                    OK
                </button>
                <button
                    onClick={() => {
                        showUpdates();
                    }}
                    className="rounded-full bg-info px-6 py-2.5 text-sm font-medium text-primary-content shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:bg-base-300 disabled:hover:scale-100"
                >
                    Show
                </button>
                <button
                    onClick={() => {
                        setSidePanelVisible(false);
                        setFoundPII(false);
                        setPII([]);
                        setTags([]);
                        setReset((prev) => prev++);
                    }}
                    className="rounded-full bg-error px-6 py-2.5 text-sm font-medium text-primary-content shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:bg-base-300 disabled:hover:scale-100"
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        findPII(dicomData, files, {
                            setLoading,
                            setLoadingMsg,
                            setShowAlert,
                            setAlertMsg,
                            setAlertType,
                            setPII,
                            setFoundPII,
                            tagsToAnon,
                        });
                    }}
                    className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-content shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:bg-base-300 disabled:hover:scale-100"
                >
                    Find PII
                </button>
            </div>

            {foundPII && (
                <PIIResultsTable
                    PII={PII}
                    reset={reset}
                    onUpdateValue={handleUpdateValue}
                />
            )}

            <table className="m-4 mb-10 border bg-base-100 text-lg text-base-content">
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
                    {tags.map((tag, index) => (
                        <DicomTableRow
                            key={index + tag.tagId + reset}
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
