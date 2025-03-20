import { create } from "zustand";
import { isSafari } from "react-device-detect";
import { TagsAnon } from "@auto/Functions/TagsAnon";
import logger from "@logger/Logger";
import { CustomFile } from "@file/Types/FileTypes";
import {
    TableUpdateData,
    DicomData,
    AnonTag,
} from "../Features/DicomTagTable/Types/DicomTypes";
import { TagDictionary } from "@dataFunctions/TagDictionary/dictionary";

// interface tagIdAnon {
//     tagId: string;
//     name: string;
//     value: string;
// }

/**
 * Global application state store
 * @description Centralized state management store using Zustand to handle application state
 *
 * @typedef {Object} Store - The global state store interface
 * @property {CustomFile[]} files - List of uploaded DICOM files
 * @property {(files: CustomFile[]) => void} setFiles - Update the list of files
 *
 * @property {DicomData[]} dicomData - Parsed DICOM data for all uploaded files
 * @property {(dicomData: DicomData[]) => void} setDicomData - Update the DICOM data
 *
 * @property {number} currentFileIndex - Index of the currently selected file
 * @property {(index: number) => void} setCurrentFileIndex - Update the current file index
 *
 * @property {boolean} loading - Whether the application is in a loading state
 * @property {(loading: boolean) => void} setLoading - Update the loading state
 *
 * @property {string} loadingMsg - Message to display during loading
 * @property {(msg: string) => void} setLoadingMsg - Update the loading message
 *
 * @property {boolean} showErrorModal - Whether to show the error modal
 * @property {() => void} showError - Show the error modal
 * @property {(show: boolean) => void} setShowErrorModal - Update the error modal visibility
 *
 * @property {boolean} sidebarVisible - Whether the sidebar is visible
 * @property {(visible: boolean) => void} setSidebarVisible - Update sidebar visibility
 *
 * @property {boolean} sidePanelVisible - Whether the side panel is visible
 * @property {(visible: boolean) => void} setSidePanelVisible - Update side panel visibility
 *
 * @property {boolean} autoAnonTagsEditPanelVisible - Whether the auto anonymization tags edit panel is visible
 * @property {(visible: boolean) => void} setAutoAnonTagsEditPanelVisible - Update auto anonymization tags edit panel visibility
 *
 * @property {boolean} showSeriesModal - Whether to show the series modal
 * @property {(show: boolean) => void} setShowSeriesModal - Update series modal visibility
 *
 * @property {boolean} series - Whether files are being treated as a series
 * @property {(series: boolean) => void} setSeries - Update series state
 * @property {() => void} toggleSeries - Toggle series state
 *
 * @property {boolean} seriesSwitchModel - Whether to use the series switch model
 * @property {(switchModel: boolean) => void} setSeriesSwitchModel - Update series switch model state
 *
 * @property {string} downloadOption - Current download option ("single" or "zip")
 * @property {(option: string) => void} setDownloadOption - Update download option
 *
 * @property {string} theme - Current theme ("corporate" or "night")
 * @property {() => void} toggleTheme - Toggle between light and dark themes
 *
 * @property {TableUpdateData[]} newTagValues - Tags with updated values
 * @property {(tags: TableUpdateData) => void} setNewTagValues - Add or update a tag value
 * @property {() => void} emptyNewTagValues - Clear all new tag values
 *
 * @property {boolean} showHiddenTags - Whether to show hidden DICOM tags
 * @property {(show: boolean) => void} setShowHiddenTags - Update hidden tags visibility
 *
 * @property {AnonTag[]} tags - Tags for anonymization
 * @property {(tags: AnonTag[]) => void} setTags - Update anonymization tags
 *
 * @property {boolean} hideTagNumber - Whether to hide tag numbers
 * @property {(hide: boolean) => void} setHideTagNumber - Update tag number visibility
 *
 * @property {() => void} clearData - Clear all application data
 *
 * @property {string[]} fileParseErrorFileNames - List of files that failed to parse
 * @property {(fileNames: string[]) => void} setFileParseErrorFileNames - Update list of files with parse errors
 *
 * @property {boolean} addTag - Whether the add tag UI is visible
 * @property {(show: boolean) => void} setShowAddTag - Update add tag UI visibility
 *
 * @property {boolean} showAlert - Whether to show an alert
 * @property {(show: boolean) => void} setShowAlert - Update alert visibility
 *
 * @property {string} alertMsg - Alert message text
 * @property {(msg: string) => void} setAlertMsg - Update alert message
 *
 * @property {string} alertType - Alert type ("alert-error", "alert-success", or "alert-warning")
 * @property {(type: string) => void} setAlertType - Update alert type
 *
 * @property {boolean} allowEditLockedTags - Whether to allow editing of locked tags
 * @property {(allowEdit: boolean) => void} setAllowEditLockedTags - Update locked tags edit permission
 *
 * @property {any[]} tagsToAnon - List of tags to anonymize
 * @property {(tags: any) => void} setTagsToAnon - Update list of tags to anonymize
 * @property {() => void} resetTagsAnon - Reset anonymization tags to defaults
 *
 * @property {Record<string, File[]>} fileStructure - Mapping of folder paths to file lists
 * @property {(structure: Record<string, File[]>) => void} setFileStructure - Update file structure
 */
type Store = {
    files: CustomFile[];
    setFiles: (files: CustomFile[]) => void;

    dicomData: DicomData[];
    setDicomData: (dicomData: DicomData[]) => void;

    currentFileIndex: number;
    setCurrentFileIndex: (index: number) => void;

    loading: boolean;
    setLoading: (loading: boolean) => void;

    loadingMsg: string;
    setLoadingMsg: (msg: string) => void;

    showErrorModal: boolean;
    showError: () => void;
    setShowErrorModal: (show: boolean) => void;

    sidebarVisible: boolean;
    setSidebarVisible: (visible: boolean) => void;

    sidePanelVisible: boolean;
    setSidePanelVisible: (visible: boolean) => void;

    autoAnonTagsEditPanelVisible: boolean;
    setAutoAnonTagsEditPanelVisible: (visible: boolean) => void;

    showSeriesModal: boolean;
    setShowSeriesModal: (show: boolean) => void;

    series: boolean;
    setSeries: (series: boolean) => void;
    toggleSeries: () => void;

    seriesSwitchModel: boolean;
    setSeriesSwitchModel: (switchModel: boolean) => void;

    downloadOption: string;
    setDownloadOption: (option: string) => void;

    theme: string;
    toggleTheme: () => void;

    newTagValues: TableUpdateData[];
    setNewTagValues: (tags: TableUpdateData) => void;
    emptyNewTagValues: () => void;

    showHiddenTags: boolean;
    setShowHiddenTags: (show: boolean) => void;

    tags: AnonTag[];
    setTags: (tags: AnonTag[]) => void;

    hideTagNumber: boolean;
    setHideTagNumber: (hide: boolean) => void;

    clearData: () => void;

    fileParseErrorFileNames: string[];
    setFileParseErrorFileNames: (fileNames: string[]) => void;

    addTag: boolean;
    setShowAddTag: (show: boolean) => void;

    showAlert: boolean;
    setShowAlert: (show: boolean) => void;

    alertMsg: string;
    setAlertMsg: (msg: string) => void;

    alertType: string;
    setAlertType: (type: string) => void;

    allowEditLockedTags: boolean;
    setAllowEditLockedTags: (allowEdit: boolean) => void;

    tagsToAnon: any[];
    setTagsToAnon: (tags: any) => void;
    resetTagsAnon: () => void;

    fileStructure: Record<string, File[]>;
    setFileStructure: (struture: Record<string, File[]>) => void;

    showDictEdit: boolean;
    setShowDictEdit: (show: boolean) => void;

    tagDictionary: any[];
    updateTagDictionary: (tags: any) => void;
    resetTagDictionary: () => void;
};

/**
 * Global state store instance
 * @description Creates the centralized state management store using Zustand
 *
 * @remarks
 * This store contains all global application state including:
 * - File management (DICOM files, parsed data, folder structure)
 * - UI state (loading, modals, panels, themes)
 * - Tag management (tag values, anonymization settings)
 * - Application preferences (stored in localStorage where appropriate)
 *
 * @example
 * // Access state in a component
 * const files = useStore(state => state.files);
 * const setFiles = useStore(state => state.setFiles);
 *
 * // Update state
 * setFiles(newFiles);
 *
 * @returns {Store} The initialized Zustand store with all state and actions
 */
export const useStore = create<Store>((set) => ({
    files: [] as CustomFile[],
    setFiles: (files) => set({ files }),

    dicomData: [] as DicomData[],
    setDicomData: (dicomData) => set({ dicomData }),

    currentFileIndex: 0,
    setCurrentFileIndex: (index) => set({ currentFileIndex: index }),

    loading: false,
    setLoading: (loading) => set({ loading }),

    loadingMsg: "",
    setLoadingMsg: (msg) => set({ loadingMsg: msg }),

    showErrorModal: false,
    showError: () => set({ showErrorModal: true }),
    setShowErrorModal: (show) => set({ showErrorModal: show }),

    sidebarVisible: false,
    setSidebarVisible: (visible) => set({ sidebarVisible: visible }),

    sidePanelVisible: false,
    setSidePanelVisible: (visible) => set({ sidePanelVisible: visible }),

    showSeriesModal: false,
    setShowSeriesModal: (show) => set({ showSeriesModal: show }),

    hideTagNumber: false,
    setHideTagNumber: (hide) => set({ hideTagNumber: hide }),

    series: false,
    setSeries: (series) => set({ series }),
    toggleSeries: () => set((state) => ({ series: !state.series })),

    seriesSwitchModel: false,
    setSeriesSwitchModel: (switchModel) =>
        set({ seriesSwitchModel: switchModel }),

    downloadOption: isSafari
        ? "zip"
        : (localStorage.getItem("downloadOption") ?? "zip"),

    setDownloadOption: (option) => {
        set({ downloadOption: option });
        localStorage.setItem("downloadOption", option);
    },

    theme: localStorage.getItem("theme") ?? "corporate",
    toggleTheme: () =>
        set((state) =>
            state.theme === "corporate"
                ? { theme: "night" }
                : { theme: "corporate" }
        ),

    newTagValues: [] as TableUpdateData[],
    setNewTagValues: (tags: TableUpdateData) =>
        set((state) => {
            const existingIndex = state.newTagValues.findIndex(
                (item) =>
                    item.fileName === tags.fileName && item.tagId === tags.tagId
            );

            if (existingIndex !== -1) {
                // Update the existing tag value
                const updatedTagValues = state.newTagValues.map(
                    (item, index) => (index === existingIndex ? tags : item)
                );
                return { newTagValues: updatedTagValues };
            }

            // Add new tag if it doesn't exist
            return { newTagValues: [...state.newTagValues, tags] };
        }),
    emptyNewTagValues: () => set({ newTagValues: [] }),

    showHiddenTags: JSON.parse(
        localStorage.getItem("showHiddenTags") ?? "false"
    ),
    setShowHiddenTags: (show) => set({ showHiddenTags: show }),

    tags: [] as AnonTag[],
    setTags: (tags) => set({ tags }),

    clearData: () => {
        set({ newTagValues: [] });
        set({ dicomData: [] });
        set({ files: [] });
        set({ currentFileIndex: 0 });
        set({ loading: false });
        set({ sidebarVisible: false });
        set({ series: false });
    },

    fileParseErrorFileNames: [] as string[],
    setFileParseErrorFileNames: (fileNames) =>
        set({ fileParseErrorFileNames: fileNames }),

    addTag: false,
    setShowAddTag: (show) => set({ addTag: show }),

    showAlert: false,
    setShowAlert: (show) => set({ showAlert: show }),

    alertMsg: "Alert",
    setAlertMsg: (msg) => set({ alertMsg: msg }),

    alertType: "alert-error",
    setAlertType: (type) => {
        set({
            alertType:
                type !== "alert-error" &&
                    type !== "alert-success" &&
                    type !== "alert-warning"
                    ? "alert-error"
                    : type,
        });
        logger.debug(`Alert type: ${type}`);
    },

    allowEditLockedTags: false,
    setAllowEditLockedTags: (allowEdit) =>
        set({ allowEditLockedTags: allowEdit }),

    autoAnonTagsEditPanelVisible: false,
    setAutoAnonTagsEditPanelVisible: (visible) =>
        set({ autoAnonTagsEditPanelVisible: visible }),

    tagsToAnon: JSON.parse(
        localStorage.getItem("TagsAutoList") ?? JSON.stringify(TagsAnon)
    ),
    setTagsToAnon: (tags) => {
        set({ tagsToAnon: tags });
        localStorage.setItem("TagsAutoList", JSON.stringify(tags));
    },
    resetTagsAnon: () => {
        set({ tagsToAnon: TagsAnon });
        set({alertType: "alert-warning"})
        set({ alertMsg: "Tags Reset to Default" });
        set({ showAlert: true });
        localStorage.setItem("TagsAutoList", JSON.stringify(TagsAnon));
    },

    fileStructure: {},
    setFileStructure: (structure) => {
        set({ fileStructure: structure });
    },

    showDictEdit: false,
    setShowDictEdit: (show) => set({ showDictEdit: show }),

    tagDictionary: [],
    updateTagDictionary: (tags) => {
        set({ tagDictionary: tags });
    },
    resetTagDictionary: () => set({ tagDictionary: [] })

}));
