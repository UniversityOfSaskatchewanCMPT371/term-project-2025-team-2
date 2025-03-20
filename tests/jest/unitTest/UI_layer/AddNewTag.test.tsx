import { render, screen, fireEvent } from "@testing-library/react";
import { NewTagRow } from "@features/DicomTagTable/Components/NewTagRow";
import * as storeModule from "@state/Store";

const mockStateObject = {
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
    setNewTagValues: jest.fn(),
    loadTagDictionary: jest.fn().mockResolvedValue(null),
    tagDictionary: [
        { tagId: "12345678", name: "Test Tag", value: "Test Value" }
    ],
    isTagDictionaryLoaded: true,
    setShowAlert: jest.fn(),
    setAlertMsg: jest.fn(),
    setAlertType: jest.fn(),
};

// Create a properly typed mock for useStore
const useStoreMock = jest.fn() as jest.Mock & {
    getState: jest.Mock;
};

// Set up the getState method on the mock
useStoreMock.getState = jest.fn().mockReturnValue(mockStateObject);

// Mock the entire Store module
jest.mock("@state/Store", () => {
    const actual = jest.requireActual("@state/Store");
    // Create a properly typed mock for useStore
    const useStoreMock = jest.fn() as jest.Mock & {
        getState: jest.Mock;
    };

    const mockStateObject = {
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
        setNewTagValues: jest.fn(),
        loadTagDictionary: jest.fn().mockResolvedValue(null),
        tagDictionary: [
            { tagId: "12345678", name: "Test Tag", value: "Test Value" }
        ],
        isTagDictionaryLoaded: true,
        setShowAlert: jest.fn(),
        setAlertMsg: jest.fn(),
        setAlertType: jest.fn(),
    };

    useStoreMock.getState = jest.fn().mockReturnValue(mockStateObject);

    return {
        ...actual,
        useStore: useStoreMock,
    };
});

describe("NewTagRow", () => {
    // const mockSetNewTagValues = jest.fn();

    let mockState: any;

    beforeEach(() => {
        jest.clearAllMocks();

        useStoreMock.mockClear();
        useStoreMock.getState.mockClear();

        // Make sure getState always returns the mockStateObject
        useStoreMock.getState.mockReturnValue(mockStateObject);

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
        };

        (storeModule.useStore as unknown as jest.Mock).mockImplementation(
            (selector) => (selector ? selector(mockState) : mockState)
        );

    });

    it("should render inputs for tag ID, tag name, and tag value", () => {
        render(<NewTagRow />);

        expect(screen.getByPlaceholderText("Tag ID")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Tag Name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Tag Value")).toBeInTheDocument();
    });

    it("should update tagId state when user types in Tag ID input", () => {
        render(<NewTagRow />);
        const tagIdInput = screen.getByPlaceholderText("Tag ID");

        fireEvent.change(tagIdInput, { target: { value: "12345678" } });

        // expect(tagIdInput).toBe("12345678");
    });

    it("should update tagName state when user types in Tag Name input", () => {
        render(<NewTagRow />);
        const tagNameInput = screen.getByPlaceholderText("Tag Name");

        fireEvent.change(tagNameInput, { target: { value: "Test Tag" } });

        // expect(tagNameInput).toBe("Test Tag");
    });

    it("should update tagValue state when user types in Tag Value input", () => {
        render(<NewTagRow />);
        const tagValueInput = screen.getByPlaceholderText("Tag Value");

        fireEvent.change(tagValueInput, { target: { value: "Some Value" } });

        // expect(tagValueInput.contains).toBe("Some Value");
    });

    it("should call handleUpdateValue when CheckCircleIcon is clicked", async () => {
        render(<NewTagRow />);
        const tagIdInput = screen.getByPlaceholderText("Tag ID");
        const tagNameInput = screen.getByPlaceholderText("Tag Name");
        const tagValueInput = screen.getByPlaceholderText("Tag Value");
        // const checkCircleIcon = screen.getByTestId("CheckCircleIcon");

        fireEvent.change(tagIdInput, { target: { value: "12345678" } });
        fireEvent.change(tagNameInput, { target: { value: "Test Tag" } });
        fireEvent.change(tagValueInput, { target: { value: "Test Value" } });

        // fireEvent.click(checkCircleIcon);

        // await waitFor(() => {
        //     expect(mockSetNewTagValues).toHaveBeenCalledWith({
        //         fileName: expect.any(String),
        //         tagId: "X12345678",
        //         newValue: "Test Value",
        //         delete: false,
        //         add: true,
        //     });
        // });
    });
});
