import { useStore } from "@state/Store";
import { DicomTableRow } from "@features/DicomTagTable/Components/DicomTableRow";
import { AutoAnon } from "@auto/Functions/AutoClean";
import { useState } from "react";
import { DicomTag } from "@dicom//Types/DicomTypes";
import { TagsAnon } from "@auto/Functions/TagsAnon";
import logger from "@logger/Logger";

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

    const [reset, setReset] = useState<number>(0);

    const fileStructure = useStore((state) => state.fileStructure);

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

    const handleAutoAnon = async () => {
        logger.debug("Auto Anonymizing tags");

        await AutoAnon(dicomData, files, tags, tagsToAnon, fileStructure);

        clearData();
        setSidePanelVisible(false);
        setFoundPII(false);
        setPII([]);
        setReset((prev) => prev++);
        setTags([]);
    };

    const regex = new RegExp(/^[A-Za-z]+(?: [A-Za-z]+)?$/);
    const notPII = [
        "ANONYMIZED",
        "ANONYMOUS",
        "NONE",
        "FREE FORM",
        "COMPOSITE",
        "VOID",
        "VOLUME VIEWER",
        "MEASURED",
        "PREDICTED",
    ];
    const [PII, setPII] = useState<DicomTag[]>([]);
    const [foundPII, setFoundPII] = useState(false);

    const setShowAlert = useStore((state) => state.setShowAlert);
    const setAlertMsg = useStore((state) => state.setAlertMsg);
    const setAlertType = useStore((state) => state.setAlertType);

    const findPII = async () => {
        setLoadingMsg(`Finding PII, searching all ${files.length}`);
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 0));

        setPII([]);
        setFoundPII(false);

        const localPII: DicomTag[] = [];

        try {
            for (let i = 0; i < dicomData.length; i++) {
                const data = dicomData[i];

                setLoadingMsg(
                    `Searching for PII in file ${i + 1} of ${files.length}`
                );
                await new Promise((resolve) => setTimeout(resolve, 0));

                for (const tag of Object.values(data.tags)) {
                    if (typeof tag.value !== "string") {
                        continue;
                    }

                    if (
                        TagsAnon.some((anonTag) => anonTag.tagId === tag.tagId)
                    ) {
                        continue;
                    }

                    if (
                        regex.test(tag.value as string) &&
                        (tag.value as string).length > 3 &&
                        !notPII.includes((tag.value as string).toUpperCase()) &&
                        !tagsToAnon.includes(tag.tagId) &&
                        tag.value.split(" ").length <= 2 &&
                        (tag.value as string).toUpperCase() !==
                            (tag.value as string)
                    ) {
                        if (
                            !localPII.some(
                                (existingTag) => existingTag.tagId === tag.tagId
                            )
                        ) {
                            localPII.push(tag);

                            logger.info(
                                `Potential PII found: ${tag.tagId}, ${tag.value}`
                            );

                            if (localPII.length > 25) {
                                setAlertMsg("Max Amount of PII exceeded");
                                setAlertType("alert-error");
                                setShowAlert(true);

                                setPII(localPII);
                                setFoundPII(localPII.length > 0);
                                setReset((prev) => prev + 1);
                                setLoading(false);
                                return;
                            }
                        }
                    }
                }
            }

            setPII(localPII);
            setFoundPII(localPII.length > 0);
            setReset((prev) => prev + 1);

            setLoading(false);

            if (localPII.length === 0) {
                setAlertMsg("No potential PII found in file");
                setAlertType("alert-success");
                setShowAlert(true);
            }
        } catch (error) {
            logger.error("Error finding PII:", error);
            setLoading(false);
            setAlertMsg("Error searching for PII");
            setAlertType("alert-error");
            setShowAlert(true);
        }
    };

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
                        setLoading(true);
                        setLoadingMsg("Anonymizing tags...");
                        handleAutoAnon();
                    }}
                    className="rounded-full bg-success px-6 py-2.5 text-sm font-medium text-primary-content shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:bg-base-300 disabled:hover:scale-100"
                >
                    OK
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
                    onClick={() => findPII()}
                    className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-content shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:bg-base-300 disabled:hover:scale-100"
                >
                    Find PII
                </button>
            </div>

            {foundPII ? (
                <div>
                    <div className="mb-5 ml-4 text-xl font-bold text-error">
                        Potential PII Found in File
                    </div>
                    <table className="m-4 mb-10 border bg-base-100 text-lg text-base-content">
                        <thead>
                            <tr className="text-wrap bg-error">
                                <th className="w-1/5 border px-4 py-2 text-primary-content">
                                    Tag ID
                                </th>
                                <th className="w-1/4 border px-4 py-2 text-primary-content">
                                    Tag Name
                                </th>
                                <th className="w-7/12 border px-4 py-2 text-primary-content">
                                    Value
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {PII.map((tag, index) => (
                                <DicomTableRow
                                    key={index + tag.tagId + reset}
                                    row={{
                                        tagId: tag.tagId,
                                        tagName: tag.tagName,
                                        value: tag.value as string,
                                    }}
                                    index={index}
                                    onUpdateValue={handleUpdateValue}
                                    updated={false}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : null}

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
