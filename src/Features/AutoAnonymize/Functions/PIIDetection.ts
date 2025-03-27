import { useState } from "react";
import { DicomTag } from "@dicom//Types/DicomTypes";
import { TagsAnon } from "@auto/Functions/TagsAnon";
import { useStore } from "@state/Store";
import logger from "@logger/Logger";
import { CustomFile } from "@file/Types/FileTypes";

/**
 * Configuration for PII detection
 */
interface PIIDetectionOptions {
    setLoading: (isLoading: boolean) => void;
    setLoadingMsg: (msg: string) => void;
    setShowAlert: (show: boolean) => void;
    setAlertMsg: (msg: string) => void;
    setAlertType: (type: string) => void;
    setPII: (pii: DicomTag[]) => void;
    setFoundPII: (found: boolean) => void;
    tagsToAnon: string[];
}

// Constants for PII detection
const PII_REGEX = new RegExp(/^[A-Za-z]+(?: [A-Za-z]+)?$/);
const NOT_PII = [
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

/**
 * Scans loaded DICOM files for potential personally identifiable information
 * @function
 * @param {any[]} dicomData - Array of DICOM data objects
 * @param {File[]} files - Array of loaded files
 * @param {PIIDetectionOptions} options - Configuration options for PII detection
 * @precondition DICOM files must be loaded into the application
 * @postcondition PII state is updated with found PII tags, alert is shown with results,
 *                loading state is set to false when complete
 * @returns {Promise<DicomTag[]>} A promise that resolves with found PII tags
 */
export const findPII = async (
    dicomData: any[],
    files: CustomFile[],
    options: PIIDetectionOptions
): Promise<DicomTag[]> => {
    const {
        setLoading,
        setLoadingMsg,
        setShowAlert,
        setAlertMsg,
        setAlertType,
        setPII,
        setFoundPII,
        tagsToAnon
    } = options;

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

            for (const tag of Object.values(data.tags) as DicomTag[]) {
                if (typeof tag.value !== "string") {
                    continue;
                }

                if (TagsAnon.some((anonTag) => anonTag.tagId === tag.tagId)) {
                    continue;
                }

                if (
                    PII_REGEX.test(tag.value as string) &&
                    (tag.value as string).length > 3 &&
                    !NOT_PII.includes((tag.value as string).toUpperCase()) &&
                    !tagsToAnon.includes(tag.tagId) &&
                    tag.value.split(" ").length <= 2 &&
                    (tag.value as string).toUpperCase() !== (tag.value as string)
                ) {
                    if (!localPII.some((existingTag) => existingTag.tagId === tag.tagId)) {
                        localPII.push(tag);

                        logger.info(`Potential PII found: ${tag.tagId}, ${tag.value}`);

                        // if (localPII.length > 25) {
                        //     setAlertMsg("Max Amount of PII exceeded");
                        //     setAlertType("alert-error");
                        //     setShowAlert(true);

                        //     setPII(localPII);
                        //     setFoundPII(localPII.length > 0);
                        //     setReset((prev) => prev + 1);
                        //     setLoading(false);
                        //     return localPII;
                        // }
                    }
                }
            }
        }

        setPII(localPII);
        setFoundPII(localPII.length > 0);

        setLoading(false);

        if (localPII.length === 0) {
            setAlertMsg("No potential PII found in file");
            setAlertType("alert-success");
            setShowAlert(true);
        }

        return localPII;
    } catch (error) {
        logger.error("Error finding PII:", error);
        setLoading(false);
        setAlertMsg("Error searching for PII");
        setAlertType("alert-error");
        setShowAlert(true);
        return [];
    }
};

/**
 * Component that handles PII detection functionality
 * @component
 * @precondition DICOM files must be loaded into the application
 * @postcondition Provides functionality to scan DICOM files for PII
 * @returns {Object} Object containing PII detection state and functions
 */
export const usePIIDetection = () => {
    const dicomData = useStore((state) => state.dicomData);
    const files = useStore((state) => state.files);
    const tagsToAnon = useStore((state) => state.tagsToAnon);
    const setLoading = useStore((state) => state.setLoading);
    const setLoadingMsg = useStore((state) => state.setLoadingMsg);
    const setShowAlert = useStore((state) => state.setShowAlert);
    const setAlertMsg = useStore((state) => state.setAlertMsg);
    const setAlertType = useStore((state) => state.setAlertType);
    

    const [PII, setPII] = useState<DicomTag[]>([]);
    const [foundPII, setFoundPII] = useState(false);

    const findPIIWrapper = async () => {
        await findPII(dicomData, files, {
            setLoading,
            setLoadingMsg,
            setShowAlert,
            setAlertMsg,
            setAlertType,
            setPII,
            setFoundPII,
            tagsToAnon
        });
    };

    return {
        PII,
        setPII,
        foundPII,
        setFoundPII,
        findPII: findPIIWrapper
    };
};
