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

// interface tagIdAnon {
//     tagId: string;
//     name: string;
//     value: string;
// }

/**
 * Store for global state management
 * @typedef Store
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

    alterType: string;
    setAlterType: (type: string) => void;

    allowEditLockedTags: boolean;
    setAllowEditLockedTags: (allowEdit: boolean) => void;

    tagsToAnon: any[];
    setTagsToAnon: (tags: any) => void;
    resetTagsAnon: () => void;
};

/**
 * Store for global state management
 * @type {Store}
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

    alterType: "alert-error",
    setAlterType: (type) => {
        set({
            alterType:
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
        localStorage.setItem("TagsAutoList", JSON.stringify(TagsAnon));
    },
}));
