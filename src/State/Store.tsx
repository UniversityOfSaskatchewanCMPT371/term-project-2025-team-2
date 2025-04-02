import { create } from "zustand";
import { isSafari } from "react-device-detect";
import { TagsAnon } from "@auto/Functions/TagsAnon";
import logger from "@logger/Logger";
import { FileData } from "@file/Types/FileTypes";
import {
    TableUpdateData,
    DicomData,
    AnonTag,
} from "../Features/DicomTagTable/Types/DicomTypes";
import { standardDataElements } from "@services/standardDataElements";
import {
    tagDictionaryDB,
    TagDictionaryItem,
} from "../Services/TagDictionaryDB";

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
 *
 * @property {boolean} showDictEdit - Whether to show the dictionary edit UI
 * @property {(show: boolean) => void} setShowDictEdit - Update dictionary edit UI visibility
 *
 * @property {TagDictionaryItem[]} tagDictionary - List of tags in the dictionary
 * @property {boolean} isTagDictionaryLoaded - Whether the tag dictionary is loaded
 * @property {() => Promise<void>} loadTagDictionary - Load the tag dictionary
 * @property {(tag: TagDictionaryItem) => Promise<boolean>} addTagToDictionary - Add a tag to the dictionary
 * @property {(tag: TagDictionaryItem) => Promise<boolean>} updateTagInDictionary - Update a tag in the dictionary
 * @property {(tagId: string) => Promise<boolean>} removeTagFromDictionary - Remove a tag from the dictionary
 * @property {() => Promise<boolean>} resetTagDictionary - Reset the tag dictionary to defaults
 */
type Store = {
    files: FileData[];
    setFiles: (files: FileData[]) => void;

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

    tagDictionary: TagDictionaryItem[];
    isTagDictionaryLoaded: boolean;
    loadTagDictionary: () => Promise<void>;
    addTagToDictionary: (tag: TagDictionaryItem) => Promise<boolean>;
    updateTagInDictionary: (tag: TagDictionaryItem) => Promise<boolean>;
    removeTagFromDictionary: (tagId: string) => Promise<boolean>;
    resetTagDictionary: () => Promise<boolean>;
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
    files: [] as FileData[],
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
        set({ alertType: "alert-warning" });
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

    tagDictionary: [] as TagDictionaryItem[],
    isTagDictionaryLoaded: false,

    loadTagDictionary: async () => {
        try {
            // Try to get tags from IndexedDB
            const dbInitialized = await tagDictionaryDB.initDB();

            if (dbInitialized) {
                const tags = await tagDictionaryDB.getAllTags();

                // If the DB is empty, load default values
                if (tags.length === 0) {
                    await tagDictionaryDB.resetToDefaults();
                    const defaultTags = await tagDictionaryDB.getAllTags();
                    set({
                        tagDictionary: defaultTags,
                        isTagDictionaryLoaded: true,
                    });
                    logger.info(
                        "Tag dictionary loaded with default values from IndexedDB"
                    );
                } else {
                    set({
                        tagDictionary: tags,
                        isTagDictionaryLoaded: true,
                    });
                    logger.info(
                        `Tag dictionary loaded with ${tags.length} items from IndexedDB`
                    );
                }
            } else {
                // Fallback to standard data elements if IndexedDB is not available
                logger.warn(
                    "IndexedDB not available, using standard data elements"
                );
                const fallbackTags = Object.entries(standardDataElements).map(
                    ([tagId, data]) => ({
                        tagId,
                        name: data.name,
                        vr: data.vr,
                    })
                );
                set({
                    tagDictionary: fallbackTags,
                    isTagDictionaryLoaded: true,
                });
            }
        } catch (error) {
            logger.error("Error loading tag dictionary:", error);
            set({ isTagDictionaryLoaded: false });
        }
    },

    addTagToDictionary: async (tag: TagDictionaryItem) => {
        const success = await tagDictionaryDB.addTag(tag);

        if (success) {
            // Update the local state
            set((state) => ({
                tagDictionary: [...state.tagDictionary, tag],
            }));

            set({
                alertMsg: `Tag ${tag.tagId} added to dictionary`,
                alertType: "alert-success",
                showAlert: true,
            });
        } else {
            set({
                alertMsg: `Failed to add tag ${tag.tagId}`,
                alertType: "alert-error",
                showAlert: true,
            });
        }

        return success;
    },

    updateTagInDictionary: async (tag: TagDictionaryItem) => {
        const success = await tagDictionaryDB.updateTag(tag);

        if (success) {
            // Update the local state
            set((state) => ({
                tagDictionary: state.tagDictionary.map((t) =>
                    t.tagId === tag.tagId ? tag : t
                ),
            }));

            set({
                alertMsg: `Tag ${tag.tagId} updated`,
                alertType: "alert-success",
                showAlert: true,
            });
        } else {
            set({
                alertMsg: `Failed to update tag ${tag.tagId}`,
                alertType: "alert-error",
                showAlert: true,
            });
        }

        return success;
    },

    removeTagFromDictionary: async (tagId: string) => {
        const success = await tagDictionaryDB.removeTag(tagId);

        if (success) {
            // Update the local state
            set((state) => ({
                tagDictionary: state.tagDictionary.filter(
                    (t) => t.tagId !== tagId
                ),
            }));

            set({
                alertMsg: `Tag ${tagId} removed from dictionary`,
                alertType: "alert-success",
                showAlert: true,
            });
        } else {
            set({
                alertMsg: `Failed to remove tag ${tagId}`,
                alertType: "alert-error",
                showAlert: true,
            });
        }

        return success;
    },

    resetTagDictionary: async () => {
        set({ loadingMsg: "Resetting Tag Dictionary to Default" });
        set({ loading: true });

        const success = await tagDictionaryDB.resetToDefaults();

        if (success) {
            // Reload the dictionary after reset
            const tags = await tagDictionaryDB.getAllTags();
            set({ tagDictionary: tags });

            set({
                alertMsg: "Tag dictionary reset to defaults",
                alertType: "alert-warning",
                showAlert: true,
            });
        } else {
            set({
                alertMsg: "Failed to reset tag dictionary",
                alertType: "alert-error",
                showAlert: true,
            });
        }
        set({ loading: false });
        return success;
    },
}));
