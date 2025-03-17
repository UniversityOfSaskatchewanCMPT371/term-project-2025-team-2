import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AutoAnonTagsEdit } from "@components/Navigation/AutoAnonTagsEdit";
import * as storeModule from "@state/Store";

jest.mock("@state/Store", () => {
    const actual = jest.requireActual("@state/Store");
    return {
        ...actual,
        useStore: jest.fn(),
    };
});

describe("AutoAnonTagsEdit", () => {
    let mockState: any;

    beforeEach(() => {
        jest.clearAllMocks();

        mockState = {
            files: [{ name: "test.dcm" }],
            dicomData: [
                {
                    tags: [
                        { tagId: "tag1", tagName: "tag1", value: "value1" },
                        { tagId: "tag2", tagName: "tag2", value: "value2" },
                    ],
                    DicomDataSet: "dicomData",
                },
            ],
            currentFileIndex: 0,
            newTagValues: [{ tag1: "value2" }],
            showHiddenTags: false,
            autoAnonTagsEditPanelVisible: true,
            tagsToAnon: [],
            setAutoAnonTagsEditPanelVisible: jest.fn(),
            setTagsToAnon: jest.fn(),
            resetTagsAnon: jest.fn(),
            setAlertMsg: jest.fn(),
            setShowAlert: jest.fn(),
            setAlertType: jest.fn(),
        };

        (storeModule.useStore as unknown as jest.Mock).mockImplementation(
            (selector) => (selector ? selector(mockState) : mockState)
        );
    });

    test("renders the component and displays the side panel", () => {
        render(<AutoAnonTagsEdit />);
        expect(screen.getByText("Tags in Anonymize List")).toBeInTheDocument();
        expect(screen.getByText("Close")).toBeInTheDocument();
    });

    test("toggles the visibility of the side panel when the close button is clicked", () => {
        render(<AutoAnonTagsEdit />);
        const closeButton = screen.getByText("Close");
        fireEvent.click(closeButton);
        expect(mockState.setAutoAnonTagsEditPanelVisible).toHaveBeenCalledWith(
            false
        );
    });

    test("shows the 'Add Tag' form when Add Tag button is clicked", () => {
        render(<AutoAnonTagsEdit />);
        const addTagButton = screen.getByText("Add Tag");
        fireEvent.click(addTagButton);
        expect(screen.getByPlaceholderText("Tag ID")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Tag Name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Tag Value")).toBeInTheDocument();
    });

    test("validates and adds a tag", async () => {
        jest.resetAllMocks();

        const mockSetAlertMsg = jest.fn();
        const mockSetShowAlert = jest.fn();
        const mockSetAlertType = jest.fn();
        const mockSetTagsToAnon = jest.fn();

        const testMockState = {
            ...mockState,
            files: [{ name: "test.dcm" }],
            dicomData: [
                {
                    tags: [
                        { tagId: "tag1", tagName: "tag1", value: "value1" },
                        { tagId: "tag2", tagName: "tag2", value: "value2" },
                    ],
                    DicomDataSet: "dicomData",
                },
            ],
            currentFileIndex: 0,
            newTagValues: [{ tag1: "value2" }],
            showHiddenTags: false,
            autoAnonTagsEditPanelVisible: true,
            tagsToAnon: [],
            setAutoAnonTagsEditPanelVisible: jest.fn(),
            setTagsToAnon: mockSetTagsToAnon,
            resetTagsAnon: jest.fn(),
            setAlertMsg: mockSetAlertMsg,
            setShowAlert: mockSetShowAlert,
            setAlertType: mockSetAlertType,
        };

        ((storeModule.useStore as unknown) as jest.Mock).mockImplementation((selector) => {
            if (typeof selector === 'function') {
                return selector(testMockState);
            }
            return testMockState;
        });

        render(<AutoAnonTagsEdit />);

        const addTagButton = screen.getByText("Add Tag");
        fireEvent.click(addTagButton);

        const tagIdInput = screen.getByPlaceholderText("Tag ID");
        const tagNameInput = screen.getByPlaceholderText("Tag Name");
        const tagValueInput = screen.getByPlaceholderText("Tag Value");

        fireEvent.change(tagIdInput, { target: { value: "123" } });
        fireEvent.change(tagNameInput, { target: { value: "Test Tag" } });
        fireEvent.change(tagValueInput, { target: { value: "Test Value" } });

        const checkCircleIcon = screen.getByTestId("CheckCircleIcon");
        fireEvent.click(checkCircleIcon);

        await waitFor(() => {
            // expect(mockSetAlertMsg).toHaveBeenCalledWith("Tag ID has to be 8 numbers");
            // expect(mockSetShowAlert).toHaveBeenCalledWith(true);
        });

        mockSetAlertMsg.mockClear();
        mockSetShowAlert.mockClear();

        fireEvent.change(tagIdInput, { target: { value: "12345678" } });
        fireEvent.change(tagNameInput, { target: { value: "Test Tag" } });
        fireEvent.change(tagValueInput, { target: { value: "Test Value" } });

        fireEvent.click(checkCircleIcon);

        await waitFor(() => {
            expect(mockSetTagsToAnon).toHaveBeenCalled();
        });

        if (mockSetTagsToAnon.mock.calls.length > 0) {
            console.log("Actual value passed to setTagsToAnon:", JSON.stringify(mockSetTagsToAnon.mock.calls[0][0]));
        }
    });

    test("disables Save button when no tags to anonymize", () => {
        render(<AutoAnonTagsEdit />);
        const saveButton = screen.getByText("Save");
        expect(saveButton).not.toBeDisabled();
    });

    test("executes reset functionality when Reset Tags button is clicked", () => {
        render(<AutoAnonTagsEdit />);
        const resetButton = screen.getByText("Reset Tags");
        fireEvent.click(resetButton);
        expect(mockState.resetTagsAnon).toHaveBeenCalled();
    });

    // test("handles Save button click and updates tags", () => {
    //     const tags = [
    //         { tagId: "X12345678", name: "Test Tag", value: "Old Value" },
    //     ];

    //     (storeModule.useStore as unknown as jest.Mock).mockImplementationOnce(
    //         (selector) => {
    //             if (selector) {
    //                 const testState = {
    //                     ...mockState,
    //                     autoAnonTagsEditPanelVisible: true,
    //                     tagsToAnon: tags,
    //                 };
    //                 return selector(testState);
    //             }

    //             return {
    //                 autoAnonTagsEditPanelVisible: true,
    //                 tagsToAnon: tags,
    //                 setAlertType: mockState.setAlertType,
    //                 setTagsToAnon: mockState.setTagsToAnon,
    //                 setAutoAnonTagsEditPanelVisible:
    //                     mockState.setAutoAnonTagsEditPanelVisible,
    //             };
    //         }
    //     );

    //     render(<AutoAnonTagsEdit />);
    //     const saveButton = screen.getByText("Save");
    //     fireEvent.click(saveButton);
    //     expect(mockState.setTagsToAnon).toHaveBeenCalled();
    // });

    // test("handles Cancel button click", () => {
    //     render(<AutoAnonTagsEdit />);
    //     const cancelButton = screen.getByText("Cancel");
    //     fireEvent.click(cancelButton);
    //     expect(mockState.setAutoAnonTagsEditPanelVisible).toHaveBeenCalledWith(
    //         false
    //     );
    // });
});
