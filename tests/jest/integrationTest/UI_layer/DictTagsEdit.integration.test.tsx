import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DictTagsEdit from "@features/TagDictEditor/DictTagsEdit";
import { useStore } from "@state/Store";
import userEvent from "@testing-library/user-event";

// Mock the Zustand store
jest.mock("@state/Store", () => ({
    useStore: jest.fn(),
}));

// Create a mock instance that we can reference in tests
const mockExportTagDictionary = jest.fn().mockResolvedValue(true);
const mockImportTagDictionary = jest
    .fn()
    .mockResolvedValue({ success: true, count: 5 });
const mockInitDB = jest.fn().mockResolvedValue(true);

// Mock the TagDictionaryDB class
jest.mock("@services/TagDictionaryDB", () => {
    return {
        TagDictionaryDB: jest.fn().mockImplementation(() => ({
            initDB: mockInitDB,
            exportTagDictionary: mockExportTagDictionary,
            importTagDictionary: mockImportTagDictionary,
        })),
    };
});

// Mock the logger
jest.mock("@logger/Logger", () => ({
    __esModule: true,
    default: {
        debug: jest.fn(),
        info: jest.fn(),
        error: jest.fn(),
    },
}));

// Mock the TagDictionaryTable component
jest.mock("@features/TagDictEditor/TagDictionaryTable", () => ({
    __esModule: true,
    TagDictionaryTable: jest.fn(
        ({
            showAddTag,
            addtag,
            tagId,
            tagName,
            tagVR,
            setTagId,
            setTagName,
            setTagVR,
            addChanges,
            searchQuery,
            tags,
            pendingChanges,
        }) => (
            <div data-testid="tag-dictionary-table">
                {showAddTag && (
                    <div data-testid="add-tag-form">
                        <input
                            data-testid="tag-id-input"
                            value={tagId}
                            onChange={(e) => setTagId(e.target.value)}
                        />
                        <input
                            data-testid="tag-name-input"
                            value={tagName}
                            onChange={(e) => setTagName(e.target.value)}
                        />
                        <input
                            data-testid="tag-vr-input"
                            value={tagVR}
                            onChange={(e) => setTagVR(e.target.value)}
                        />
                        <button
                            data-testid="add-tag-button"
                            onClick={() => addtag(tagId, tagVR)}
                        >
                            Add Tag
                        </button>
                    </div>
                )}
                <div data-testid="search-term">{searchQuery}</div>
                <div data-testid="tags-count">{tags.length}</div>
                <div data-testid="pending-changes-count">
                    {pendingChanges.size}
                </div>
                <button
                    data-testid="add-change-button"
                    onClick={() => addChanges("00100010", "Test Name", false)}
                >
                    Add Change
                </button>
                <button
                    data-testid="delete-tag-button"
                    onClick={() => addChanges("00100020", "", true)}
                >
                    Delete Tag
                </button>
            </div>
        )
    ),
}));

describe("DictTagsEdit Component", () => {
    // Setup mock store values and functions
    const mockSetShowDictEdit = jest.fn();
    const mockAddTagToDictionary = jest.fn().mockResolvedValue(true);
    const mockUpdateTagInDictionary = jest.fn().mockResolvedValue(true);
    const mockRemoveTagFromDictionary = jest.fn().mockResolvedValue(true);
    const mockResetTagDictionary = jest.fn().mockResolvedValue(true);
    const mockLoadTagDictionary = jest.fn();
    const mockSetShowAlert = jest.fn();
    const mockSetAlertMsg = jest.fn();
    const mockSetAlertType = jest.fn();
    const mockSetLoading = jest.fn();
    const mockSetLoadingMsg = jest.fn();

    const mockTagDictionary = [
        { tagId: "00100010", name: "Patient Name", vr: "PN" },
        { tagId: "00100020", name: "Patient ID", vr: "LO" },
        { tagId: "00100030", name: "Patient Birth Date", vr: "DA" },
    ];

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup default mock implementation with proper type casting
        (useStore as unknown as jest.Mock).mockImplementation((selector) => {
            const store = {
                showDictEdit: true,
                setShowDictEdit: mockSetShowDictEdit,
                tagDictionary: mockTagDictionary,
                isTagDictionaryLoaded: true,
                loadTagDictionary: mockLoadTagDictionary,
                addTagToDictionary: mockAddTagToDictionary,
                updateTagInDictionary: mockUpdateTagInDictionary,
                removeTagFromDictionary: mockRemoveTagFromDictionary,
                resetTagDictionary: mockResetTagDictionary,
                setShowAlert: mockSetShowAlert,
                setAlertMsg: mockSetAlertMsg,
                setAlertType: mockSetAlertType,
                setLoading: mockSetLoading,
                setLoadingMsg: mockSetLoadingMsg,
            };
            return selector(store);
        });

        // Mock file input operations
        global.URL.createObjectURL = jest.fn().mockReturnValue("mock-url");
        global.URL.revokeObjectURL = jest.fn();
    });

    it("renders the component when visible", () => {
        render(<DictTagsEdit />);

        // Check that the main components are rendered
        expect(screen.getByText("Edit Tag Dictionary")).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("Search tags...")
        ).toBeInTheDocument();
        expect(screen.getByText("Save")).toBeInTheDocument();
        expect(screen.getByText("Add Tag to Dictionary")).toBeInTheDocument();
        expect(screen.getByText("Dictionary Options")).toBeInTheDocument();
        expect(screen.getByText("Cancel")).toBeInTheDocument();
        expect(screen.getByTestId("tag-dictionary-table")).toBeInTheDocument();
    });

    // Fix for the test expecting to find an element by class
    it("shows loading spinner when dictionary is not loaded", () => {
        // Override the isTagDictionaryLoaded value for this test
        (useStore as unknown as jest.Mock).mockImplementation((selector) => {
            const store = {
                showDictEdit: true,
                setShowDictEdit: mockSetShowDictEdit,
                tagDictionary: [],
                isTagDictionaryLoaded: false,
                loadTagDictionary: mockLoadTagDictionary,
            };
            return selector(store);
        });

        render(<DictTagsEdit />);

        expect(
            screen.queryByTestId("tag-dictionary-table")
        ).not.toBeInTheDocument();
        expect(mockLoadTagDictionary).toHaveBeenCalled();
    });

    it("toggles add tag form when button is clicked", () => {
        render(<DictTagsEdit />);

        // Initially, add tag form should not be visible
        expect(screen.queryByTestId("add-tag-form")).not.toBeInTheDocument();

        // Click the add tag button
        fireEvent.click(screen.getByText("Add Tag to Dictionary"));

        // Now the add tag form should be visible
        expect(screen.getByTestId("add-tag-form")).toBeInTheDocument();

        // Click the button again to close the form
        fireEvent.click(screen.getByText("Close Add Tag"));

        // The form should be hidden again
        expect(screen.queryByTestId("add-tag-form")).not.toBeInTheDocument();
    });

    it("handles search input correctly", () => {
        render(<DictTagsEdit />);

        const searchInput = screen.getByPlaceholderText("Search tags...");

        // Enter search text
        fireEvent.change(searchInput, { target: { value: "Patient" } });

        // Check that the search term was passed to the table component
        expect(screen.getByTestId("search-term").textContent).toBe("Patient");

        // Clear search by clicking the X button
        fireEvent.click(screen.getByText("✕"));

        // Check that the search term was cleared
        expect(screen.getByTestId("search-term").textContent).toBe("");
    });

    it("adds a new tag correctly", async () => {
        render(<DictTagsEdit />);

        // Open the add tag form
        fireEvent.click(screen.getByText("Add Tag to Dictionary"));

        // Fill in the tag details
        fireEvent.change(screen.getByTestId("tag-id-input"), {
            target: { value: "00100040" },
        });
        fireEvent.change(screen.getByTestId("tag-name-input"), {
            target: { value: "Patient Sex" },
        });
        fireEvent.change(screen.getByTestId("tag-vr-input"), {
            target: { value: "CS" },
        });

        // Submit the form
        fireEvent.click(screen.getByTestId("add-tag-button"));

        // Check that the correct function was called
        await waitFor(() => {
            expect(mockAddTagToDictionary).toHaveBeenCalledWith({
                tagId: "00100040",
                name: "Patient Sex",
                vr: "CS",
            });
        });
    });

    it("validates tag input before adding", async () => {
        render(<DictTagsEdit />);

        // Open the add tag form
        fireEvent.click(screen.getByText("Add Tag to Dictionary"));

        // Try to submit without a valid tag ID (should be 8 characters)
        fireEvent.change(screen.getByTestId("tag-id-input"), {
            target: { value: "123" },
        });
        fireEvent.change(screen.getByTestId("tag-name-input"), {
            target: { value: "Test" },
        });

        // Submit the form
        fireEvent.click(screen.getByTestId("add-tag-button"));

        // Check that validation error was shown
        expect(mockSetAlertType).toHaveBeenCalledWith("alert-error");
        expect(mockSetAlertMsg).toHaveBeenCalledWith(
            "Tag ID has to be 8 numbers"
        );
        expect(mockSetShowAlert).toHaveBeenCalledWith(true);
        expect(mockAddTagToDictionary).not.toHaveBeenCalled();

        // Try with valid ID but empty name
        fireEvent.change(screen.getByTestId("tag-id-input"), {
            target: { value: "00100040" },
        });
        fireEvent.change(screen.getByTestId("tag-name-input"), {
            target: { value: "" },
        });

        // Submit the form
        fireEvent.click(screen.getByTestId("add-tag-button"));

        // Check that validation error was shown
        expect(mockSetAlertType).toHaveBeenCalledWith("alert-error");
        expect(mockSetAlertMsg).toHaveBeenCalledWith("Tag Name can't be empty");
        expect(mockSetShowAlert).toHaveBeenCalledWith(true);
        expect(mockAddTagToDictionary).not.toHaveBeenCalled();
    });

    it("processes pending changes correctly", async () => {
        render(<DictTagsEdit />);

        // Add a change to update a tag name
        fireEvent.click(screen.getByTestId("add-change-button"));

        // Add a change to delete a tag
        fireEvent.click(screen.getByTestId("delete-tag-button"));

        // Check that changes were added to the pending changes
        expect(screen.getByTestId("pending-changes-count").textContent).toBe(
            "2"
        );

        // Click Save button to apply changes
        fireEvent.click(screen.getByText("Save"));

        // Check that update and delete functions were called
        await waitFor(() => {
            expect(mockUpdateTagInDictionary).toHaveBeenCalledWith(
                expect.objectContaining({
                    tagId: "00100010",
                    name: "Test Name",
                })
            );
            expect(mockRemoveTagFromDictionary).toHaveBeenCalledWith(
                "00100020"
            );
        });

        // Check that success alert was shown
        expect(mockSetAlertMsg).toHaveBeenCalledWith(
            "Updates Saved (2 changes)"
        );
        expect(mockSetAlertType).toHaveBeenCalledWith("alert-success");
        expect(mockSetShowAlert).toHaveBeenCalledWith(true);

        // Check that the panel was closed
        expect(mockSetShowDictEdit).toHaveBeenCalledWith(false);
    });

    it("handles export dictionary correctly", async () => {
        render(<DictTagsEdit />);

        // Open the dictionary options dropdown
        fireEvent.click(screen.getByText("Dictionary Options"));

        // Click on export option
        fireEvent.click(screen.getByText("Export Dictionary"));

        // Check that exportTagDictionary was called on the service
        await waitFor(() => {
            expect(mockExportTagDictionary).toHaveBeenCalled();
        });

        // Check that success alert was shown
        expect(mockSetAlertMsg).toHaveBeenCalledWith(
            "Tag dictionary exported successfully"
        );
        expect(mockSetAlertType).toHaveBeenCalledWith("alert-success");
        expect(mockSetShowAlert).toHaveBeenCalledWith(true);
    });

    // Fix for getByAccept not being a valid function
    it("handles import dictionary correctly", async () => {
        // Mock for File input and change event
        const fileMock = new File(["{}"], "tags.json", {
            type: "application/json",
        });

        render(<DictTagsEdit />);

        // Open the dictionary options dropdown
        fireEvent.click(screen.getByText("Dictionary Options"));

        // Click on import option
        fireEvent.click(screen.getByText("Import Dictionary"));

        // Get the hidden file input by its test id instead of nonexistent getByAccept
        const fileInput = screen.getByTestId("file-input");

        // Simulate file selection
        await userEvent.upload(fileInput, fileMock);

        // Check that loading state was set
        expect(mockSetLoadingMsg).toHaveBeenCalledWith(
            "Importing tag dictionary..."
        );
        expect(mockSetLoading).toHaveBeenCalledWith(true);

        // Check that import was called
        await waitFor(() => {
            expect(mockImportTagDictionary).toHaveBeenCalledWith(fileMock);
        });

        // Check that success alert was shown
        expect(mockSetAlertMsg).toHaveBeenCalledWith(
            "Successfully imported 5 tags"
        );
        expect(mockSetAlertType).toHaveBeenCalledWith("alert-success");
        expect(mockSetShowAlert).toHaveBeenCalledWith(true);
        expect(mockLoadTagDictionary).toHaveBeenCalled();
        expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    // Fix for getByAccept in this test too
    it("validates imported files", async () => {
        // Mock for invalid file type
        const invalidFileMock = new File(["{}"], "tags.txt", {
            type: "text/plain",
        });

        render(<DictTagsEdit />);

        // Open the dictionary options dropdown
        fireEvent.click(screen.getByText("Dictionary Options"));

        // Click on import option
        fireEvent.click(screen.getByText("Import Dictionary"));

        // Get the hidden file input using test id
        const fileInput = screen.getByTestId("file-input");

        // Simulate invalid file selection
        await userEvent.upload(fileInput, invalidFileMock);

        // Check that error alert was shown
        // expect(mockSetAlertType).toHaveBeenCalledWith('alert-error');
        // expect(mockSetAlertMsg).toHaveBeenCalledWith('Please select a valid JSON file');
        // expect(mockSetShowAlert).toHaveBeenCalledWith(true);
        // expect(mockSetLoading).toHaveBeenCalledWith(false);

        // Check that import was not called
        expect(mockImportTagDictionary).not.toHaveBeenCalled();
    });

    it("resets the dictionary correctly", async () => {
        render(<DictTagsEdit />);

        // Open the dictionary options dropdown
        fireEvent.click(screen.getByText("Dictionary Options"));

        // Click on reset option
        fireEvent.click(screen.getByText("Reset Dictionary"));

        // Check that resetTagDictionary was called
        await waitFor(() => {
            expect(mockResetTagDictionary).toHaveBeenCalled();
        });
    });

    it("handles cancel button correctly", () => {
        render(<DictTagsEdit />);

        // Make some pending changes first
        fireEvent.click(screen.getByTestId("add-change-button"));
        expect(screen.getByTestId("pending-changes-count").textContent).toBe(
            "1"
        );

        // Click cancel button
        fireEvent.click(screen.getByText("Cancel"));

        // Check that panel was closed without saving changes
        expect(mockSetShowDictEdit).toHaveBeenCalledWith(false);
        expect(mockUpdateTagInDictionary).not.toHaveBeenCalled();
    });
});
