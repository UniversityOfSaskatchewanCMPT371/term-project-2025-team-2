import { create } from "zustand";
import { isSafari } from "react-device-detect";

import { CustomFile } from "../../types/FileTypes";
import { TableUpdateData, DicomData, AnonPopupProps } from "../../types/DicomTypes";

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

    tags: AnonPopupProps[];
    setTags: (tags: AnonPopupProps[]) => void;

    showPopup: boolean;
    setShowPopup: (show: boolean) => void;

    clearData: () => void;
};

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

    showSeriesModal: false,
    setShowSeriesModal: (show) => set({ showSeriesModal: show }),

    series: false,
    setSeries: (series) => set({ series }),
    toggleSeries: () => set((state) => ({ series: !state.series })),

    seriesSwitchModel: false,
    setSeriesSwitchModel: (switchModel) =>
        set({ seriesSwitchModel: switchModel }),

    downloadOption: isSafari
        ? "zip"
        : (localStorage.getItem("downloadOption") ?? "single"),

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

    tags: [] as AnonPopupProps[],
    setTags: (tags) => set({ tags }),

    showPopup: false,
    setShowPopup: (show) => set({ showPopup: show }),

    clearData: () => {
        set({ newTagValues: [] });
        set({ dicomData: [] });
        set({ files: [] });
        set({ currentFileIndex: 0 });
        set({ loading: false });
        set({ sidebarVisible: false });
        set({ series: false });
    },
}));
