// tests/jest/unitTest/Business_layer/Store.test.ts
import { useStore } from "../../../../src/components/State/Store"; // adjust the import path as needed
import { isSafari } from "react-device-detect";

// Define sample data that adheres to the expected types.

// For CustomFile, assume it only needs a 'name' property.
const sampleFiles = [{ name: "file1.dcm" }];

// For TableUpdateData, assume it requires: fileName, tagId, newValue, and delete.
const sampleTag1 = { fileName: "file1", tagId: "T1", newValue: "value1", delete: false };
const sampleTag2 = { fileName: "file1", tagId: "T1", newValue: "value2", delete: false };
const sampleTag = { fileName: "file1", tagId: "T1", newValue: "value1", delete: false };

// For AnonTag, assume it requires: tagId, tagName, and newValue.
const sampleAnonTags = [{ tagId: "tag1", tagName: "Tag 1", newValue: "new value" }];

beforeEach(() => {
  // Reset the store state to its initial values.
  useStore.setState({
    files: [],
    dicomData: [],
    currentFileIndex: 0,
    loading: false,
    showErrorModal: false,
    sidebarVisible: false,
    showSeriesModal: false,
    series: false,
    seriesSwitchModel: false,
    downloadOption: isSafari ? "zip" : (localStorage.getItem("downloadOption") ?? "single"),
    theme: localStorage.getItem("theme") ?? "corporate",
    newTagValues: [],
    showHiddenTags: JSON.parse(localStorage.getItem("showHiddenTags") ?? "false"),
    tags: [],
    showPopup: false,
    editingTagId: null,
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
    expect(state.showSeriesModal).toBe(false);
    expect(state.series).toBe(false);
    expect(state.seriesSwitchModel).toBe(false);
    if (isSafari) {
      expect(state.downloadOption).toBe("zip");
    } else {
      expect(state.downloadOption).toBe(localStorage.getItem("downloadOption") ?? "single");
    }
    expect(state.theme).toBe(localStorage.getItem("theme") ?? "corporate");
    expect(state.newTagValues).toEqual([]);
    expect(state.showHiddenTags).toEqual(JSON.parse(localStorage.getItem("showHiddenTags") ?? "false"));
    expect(state.tags).toEqual([]);
    expect(state.showPopup).toBe(false);
    expect(state.editingTagId).toBeNull();
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

  test("setShowSeriesModal updates showSeriesModal state", () => {
    const { setShowSeriesModal } = useStore.getState();
    setShowSeriesModal(true);
    expect(useStore.getState().showSeriesModal).toBe(true);
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
    // Spy on localStorage.setItem to verify it's called.
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
    // Add new tag value.
    setNewTagValues(sampleTag1);
    expect(useStore.getState().newTagValues).toEqual([sampleTag1]);
    // Update the existing tag value.
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

  test("setShowPopup updates showPopup state", () => {
    const { setShowPopup } = useStore.getState();
    setShowPopup(true);
    expect(useStore.getState().showPopup).toBe(true);
  });

  test("setEditingTagId updates editingTagId state", () => {
    const { setEditingTagId } = useStore.getState();
    setEditingTagId("tag123");
    expect(useStore.getState().editingTagId).toBe("tag123");
    setEditingTagId(null);
    expect(useStore.getState().editingTagId).toBeNull();
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

    // Set non-default values.
    setFiles(sampleFiles);
    // We are not setting dicomData here.
    setCurrentFileIndex(3);
    setLoading(true);
    setSidebarVisible(true);
    setSeries(true);

    // Verify state is modified.
    let state = useStore.getState();
    expect(state.files.length).toBeGreaterThan(0);
    // Removed expectation for dicomData length since it wasn't set.
    expect(state.currentFileIndex).toBe(3);
    expect(state.loading).toBe(true);
    expect(state.sidebarVisible).toBe(true);
    expect(state.series).toBe(true);

    // Clear data and verify reset.
    clearData();
    state = useStore.getState();
    expect(state.files).toEqual([]);
    expect(state.dicomData).toEqual([]);
    expect(state.currentFileIndex).toBe(0);
    expect(state.loading).toBe(false);
    expect(state.sidebarVisible).toBe(false);
    expect(state.series).toBe(false);
  });
});
