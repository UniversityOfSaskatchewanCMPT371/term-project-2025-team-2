import { useStore } from "@state/Store";
import { isSafari } from "react-device-detect";

const sampleFiles = [{ name: "file1.dcm", content: new Blob }];

const sampleTag1 = {
    fileName: "file1",
    tagId: "T1",
    newValue: "value1",
    delete: false,
    add: false,
};
const sampleTag2 = {
    fileName: "file1",
    tagId: "T1",
    newValue: "value2",
    delete: false,
    add: false,
};
const sampleTag = {
    fileName: "file1",
    tagId: "T1",
    newValue: "value1",
    delete: false,
    add: false,
};

const sampleAnonTags = [
    { tagId: "tag1", tagName: "Tag 1", newValue: "new value" },
];

beforeEach(() => {
    useStore.setState({
        files: [],
        dicomData: [],
        currentFileIndex: 0,
        loading: false,
        showErrorModal: false,
        sidebarVisible: false,
        series: false,
        seriesSwitchModel: false,
        downloadOption: isSafari
            ? "zip"
            : (localStorage.getItem("downloadOption") ?? "single"),
        theme: localStorage.getItem("theme") ?? "corporate",
        newTagValues: [],
        showHiddenTags: JSON.parse(
            localStorage.getItem("showHiddenTags") ?? "false"
        ),
        tags: [],
    });
});

describe("Zustand Store", () => {
    test("initial state is set correctly", () => {
        const state = useStore.getState();
        expect(state.files).toEqual([]);
        expect(state.dicomData).toEqual([]);
        expect(state.currentFileIndex).toBe(0);
        expect(state.loading).toBe(false);
        expect(state.showErrorModal).toBe(false);
        expect(state.sidebarVisible).toBe(false);
        expect(state.series).toBe(false);
        expect(state.seriesSwitchModel).toBe(false);
        if (isSafari) {
            expect(state.downloadOption).toBe("zip");
        } else {
            expect(state.downloadOption).toBe(
                localStorage.getItem("downloadOption") ?? "single"
            );
        }
        expect(state.theme).toBe(localStorage.getItem("theme") ?? "corporate");
        expect(state.newTagValues).toEqual([]);
        expect(state.showHiddenTags).toEqual(
            JSON.parse(localStorage.getItem("showHiddenTags") ?? "false")
        );
        expect(state.tags).toEqual([]);
    });

    test("setFiles updates files state", () => {
        const { setFiles } = useStore.getState();
        setFiles(sampleFiles);
        expect(useStore.getState().files).toEqual(sampleFiles);
    });

    test("setCurrentFileIndex updates currentFileIndex", () => {
        const { setCurrentFileIndex } = useStore.getState();
        setCurrentFileIndex(2);
        expect(useStore.getState().currentFileIndex).toBe(2);
    });

    test("setLoading updates loading state", () => {
        const { setLoading } = useStore.getState();
        setLoading(true);
        expect(useStore.getState().loading).toBe(true);
    });

    test("showError sets showErrorModal to true", () => {
        const { showError } = useStore.getState();
        showError();
        expect(useStore.getState().showErrorModal).toBe(true);
    });

    test("setSidebarVisible updates sidebarVisible state", () => {
        const { setSidebarVisible } = useStore.getState();
        setSidebarVisible(true);
        expect(useStore.getState().sidebarVisible).toBe(true);
    });

    test("toggleSeries toggles series state", () => {
        const { series, toggleSeries } = useStore.getState();
        expect(series).toBe(false);
        toggleSeries();
        expect(useStore.getState().series).toBe(true);
        toggleSeries();
        expect(useStore.getState().series).toBe(false);
    });

    test("setSeriesSwitchModel updates seriesSwitchModel state", () => {
        const { setSeriesSwitchModel } = useStore.getState();
        setSeriesSwitchModel(true);
        expect(useStore.getState().seriesSwitchModel).toBe(true);
    });

    test("setDownloadOption updates downloadOption and localStorage", () => {
        const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
        const { setDownloadOption } = useStore.getState();
        setDownloadOption("single");
        expect(useStore.getState().downloadOption).toBe("single");
        expect(setItemSpy).toHaveBeenCalledWith("downloadOption", "single");
        setItemSpy.mockRestore();
    });

    test("toggleTheme toggles between corporate and night", () => {
        const { toggleTheme } = useStore.getState();
        const currentTheme = useStore.getState().theme;
        toggleTheme();
        const newTheme = useStore.getState().theme;
        if (currentTheme === "corporate") {
            expect(newTheme).toBe("night");
        } else {
            expect(newTheme).toBe("corporate");
        }
    });

    test("setNewTagValues adds a new tag and updates an existing one", () => {
        const { setNewTagValues } = useStore.getState();
        setNewTagValues(sampleTag1);
        expect(useStore.getState().newTagValues).toEqual([sampleTag1]);
        setNewTagValues(sampleTag2);
        expect(useStore.getState().newTagValues).toEqual([sampleTag2]);
    });

    test("emptyNewTagValues resets newTagValues to an empty array", () => {
        const { setNewTagValues, emptyNewTagValues } = useStore.getState();
        setNewTagValues(sampleTag);
        expect(useStore.getState().newTagValues.length).toBe(1);
        emptyNewTagValues();
        expect(useStore.getState().newTagValues).toEqual([]);
    });

    test("setShowHiddenTags updates showHiddenTags state", () => {
        const { setShowHiddenTags } = useStore.getState();
        setShowHiddenTags(true);
        expect(useStore.getState().showHiddenTags).toBe(true);
    });

    test("setTags updates tags state", () => {
        const { setTags } = useStore.getState();
        setTags(sampleAnonTags);
        expect(useStore.getState().tags).toEqual(sampleAnonTags);
    });

    test("clearData resets files, dicomData, currentFileIndex, loading, sidebarVisible, and series", () => {
        const {
            setFiles,
            setCurrentFileIndex,
            setLoading,
            setSidebarVisible,
            setSeries,
            clearData,
        } = useStore.getState();

        setFiles(sampleFiles);
        setCurrentFileIndex(3);
        setLoading(true);
        setSidebarVisible(true);
        setSeries(true);

        let state = useStore.getState();
        expect(state.files.length).toBeGreaterThan(0);
        expect(state.currentFileIndex).toBe(3);
        expect(state.loading).toBe(true);
        expect(state.sidebarVisible).toBe(true);
        expect(state.series).toBe(true);

        clearData();
        state = useStore.getState();
        expect(state.files).toEqual([]);
        expect(state.dicomData).toEqual([]);
        expect(state.currentFileIndex).toBe(0);
        expect(state.loading).toBe(false);
        expect(state.sidebarVisible).toBe(false);
        expect(state.series).toBe(false);
    });
    test("setSidePanelVisible updates sidePanelVisible", () => {
        const { setSidePanelVisible } = useStore.getState();
        setSidePanelVisible(true);
        expect(useStore.getState().sidePanelVisible).toBe(true);
    });

    test("setAutoAnonTagsEditPanelVisible updates autoAnonTagsEditPanelVisible", () => {
        const { setAutoAnonTagsEditPanelVisible } = useStore.getState();
        setAutoAnonTagsEditPanelVisible(true);
        expect(useStore.getState().autoAnonTagsEditPanelVisible).toBe(true);
    });

    test("setShowAddTag updates addTag state", () => {
        const { setShowAddTag } = useStore.getState();
        setShowAddTag(true);
        expect(useStore.getState().addTag).toBe(true);
    });

    test("setShowDictEdit updates showDictEdit state", () => {
        const { setShowDictEdit } = useStore.getState();
        setShowDictEdit(true);
        expect(useStore.getState().showDictEdit).toBe(true);
    });

    test("setAlertMsg updates alert message", () => {
        const { setAlertMsg } = useStore.getState();
        setAlertMsg("New Alert");
        expect(useStore.getState().alertMsg).toBe("New Alert");
    });

    test("setAlertType updates alert type and handles invalid types", () => {
        const { setAlertType } = useStore.getState();
        setAlertType("alert-success");
        expect(useStore.getState().alertType).toBe("alert-success");

        setAlertType("invalid-type");
        expect(useStore.getState().alertType).toBe("alert-error"); // fallback
    });

    test("setAllowEditLockedTags updates allowEditLockedTags state", () => {
        const { setAllowEditLockedTags } = useStore.getState();
        setAllowEditLockedTags(true);
        expect(useStore.getState().allowEditLockedTags).toBe(true);
    });

    test("setTagsToAnon updates and persists tagsToAnon", () => {
        const { setTagsToAnon } = useStore.getState();
        const mockTags = [{ tagId: "test", tagName: "Test Tag" }];
        setTagsToAnon(mockTags);
        expect(useStore.getState().tagsToAnon).toEqual(mockTags);
        expect(JSON.parse(localStorage.getItem("TagsAutoList") || "")).toEqual(
            mockTags
        );
    });

    test("resetTagsAnon resets tagsToAnon and shows alert", () => {
        const { resetTagsAnon } = useStore.getState();
        resetTagsAnon();
        expect(useStore.getState().alertMsg).toBe("Tags Reset to Default");
        expect(useStore.getState().alertType).toBe("alert-warning");
        expect(useStore.getState().showAlert).toBe(true);
    });

    test("setFileStructure updates fileStructure", () => {
        const { setFileStructure } = useStore.getState();
        const mockStructure = { root: [new File([""], "mock.dcm")] };
        setFileStructure(mockStructure);
        expect(useStore.getState().fileStructure).toEqual(mockStructure);
    });
});
