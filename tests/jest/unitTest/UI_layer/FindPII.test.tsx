import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SidePanel } from "../../../../src/Features/AutoAnonymize/Components/AutoConfirmPanel";
import "@testing-library/jest-dom";
import * as Store from "../../../../src/State/Store";

jest.mock("@state/Store");

const defaultStoreState = {
    setSidePanelVisible: jest.fn(),
    sidePanelVisible: true,
    tags: [],
    setTags: jest.fn(),
    files: [{ name: "file1.dcm" }],
    dicomData: [],
    tagsToAnon: [],
    fileStructure: [],
    setLoading: jest.fn(),
    setLoadingMsg: jest.fn(),
    clearData: jest.fn(),
    setShowAlert: jest.fn(),
    setAlertMsg: jest.fn(),
    setAlertType: jest.fn(),
};

function renderSidePanelWithStore(overrideState = {}) {
    const mockUseStore = Store.useStore as unknown as jest.Mock;
    const combinedState = { ...defaultStoreState, ...overrideState };
    mockUseStore.mockImplementation((selector: any) => selector(combinedState));
    render(<SidePanel />);
}

describe("SidePanel - findPII logic", () => {
    test("should display detected PII after clicking 'Find PII'", async () => {
        renderSidePanelWithStore({
            dicomData: [
                {
                    tags: {
                        x00100010: {
                            tagId: "x00100010",
                            tagName: "PatientName",
                            value: "John Doe",
                        },
                        x00100020: {
                            tagId: "x00100020",
                            tagName: "PatientID",
                            value: "12345",
                        },
                    },
                },
            ],
        });

        fireEvent.click(screen.getByText("Find PII"));

        await waitFor(() =>
            expect(
                screen.getByText("Potential PII Found in File")
            ).toBeInTheDocument()
        );

        expect(screen.getByText("x00100010")).toBeInTheDocument();
        expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    test("should show success alert when no PII is found", async () => {
        const mockSetShowAlert = jest.fn();
        const mockSetAlertMsg = jest.fn();
        const mockSetAlertType = jest.fn();

        renderSidePanelWithStore({
            dicomData: [
                {
                    tags: {
                        x00100010: {
                            tagId: "x00100010",
                            tagName: "PatientName",
                            value: "ANONYMIZED",
                        },
                    },
                },
            ],
            setShowAlert: mockSetShowAlert,
            setAlertMsg: mockSetAlertMsg,
            setAlertType: mockSetAlertType,
        });

        fireEvent.click(screen.getByText("Find PII"));

        await waitFor(() => {
            expect(mockSetAlertMsg).toHaveBeenCalledWith(
                "No potential PII found in file"
            );
            expect(mockSetAlertType).toHaveBeenCalledWith("alert-success");
            expect(mockSetShowAlert).toHaveBeenCalledWith(true);
        });
    });

    test("should not flag tags already in tagsToAnon as PII", async () => {
        renderSidePanelWithStore({
            dicomData: [
                {
                    tags: {
                        x00100010: {
                            tagId: "x00100010",
                            tagName: "PatientName",
                            value: "Jane Doe",
                        },
                    },
                },
            ],
            tagsToAnon: ["x00100010"],
        });

        fireEvent.click(screen.getByText("Find PII"));

        await waitFor(() => {
            expect(
                screen.queryByText("Potential PII Found in File")
            ).not.toBeInTheDocument();
        });
    });

    test("should clear PII and hide side panel on cancel", () => {
        const mockSetSidePanelVisible = jest.fn();
        const mockSetTags = jest.fn();

        renderSidePanelWithStore({
            tags: [
                {
                    tagId: "x00100010",
                    newValue: "John Doe",
                    tagName: "Name",
                },
            ],
            setTags: mockSetTags,
            setSidePanelVisible: mockSetSidePanelVisible,
        });

        fireEvent.click(screen.getByText("Cancel"));

        expect(mockSetTags).toHaveBeenCalledWith([]);
        expect(mockSetSidePanelVisible).toHaveBeenCalledWith(false);
    });

    test("should ignore non-string tag values", async () => {
        renderSidePanelWithStore({
            dicomData: [
                {
                    tags: {
                        x00100010: {
                            tagId: "x00100010",
                            tagName: "PixelData",
                            value: new Uint8Array([1, 2, 3]),
                        },
                    },
                },
            ],
        });

        fireEvent.click(screen.getByText("Find PII"));

        await waitFor(() => {
            expect(
                screen.queryByText("Potential PII Found in File")
            ).not.toBeInTheDocument();
        });
    });
});
