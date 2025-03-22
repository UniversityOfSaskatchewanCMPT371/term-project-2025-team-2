import { render, screen, fireEvent, within } from "@testing-library/react";
import { TagDictionaryTable } from "@features/TagDictEditor/TagDictionaryTable";
import { TagDictionaryItem } from "@services/TagDictionaryDB";

// Mock the TagDictTableRow component since we'll test it separately
jest.mock("@features/TagDictEditor/TagDictTableRow", () => ({
    TagDictTableRow: ({
        tagId,
        tagName,
        tagVR,
        onUpdateValue,
        isPendingDelete,
        pendingValue,
    }: any) => (
        <tr data-testid={`tag-row-${tagId}`}>
            <td>{tagId}</td>
            <td>{tagVR}</td>
            <td>
                {isPendingDelete && (
                    <span data-testid="pending-delete">PENDING DELETE</span>
                )}
                {pendingValue ? (
                    <span data-testid="pending-value">{pendingValue}</span>
                ) : (
                    <span>{tagName}</span>
                )}
                <button
                    data-testid={`edit-${tagId}`}
                    onClick={() => onUpdateValue(tagId, "Edited Name", false)}
                >
                    Edit
                </button>
                <button
                    data-testid={`delete-${tagId}`}
                    onClick={() => onUpdateValue(tagId, "", true)}
                >
                    Delete
                </button>
            </td>
        </tr>
    ),
}));

describe("TagDictionaryTable Component", () => {
    // Mock props
    const mockSetTagId = jest.fn();
    const mockSetTagName = jest.fn();
    const mockSetTagVR = jest.fn();
    const mockAddtag = jest.fn();
    const mockAddChanges = jest.fn();

    // Sample tag data
    const sampleTags: TagDictionaryItem[] = Array.from(
        { length: 70 },
        (_, i) => ({
            tagId: `0010${i.toString().padStart(4, "0")}`,
            name: `Tag ${i + 1}`,
            vr: i % 2 === 0 ? "PN" : "LO",
        })
    );

    // Default props
    const defaultProps = {
        showAddTag: false,
        addtag: mockAddtag,
        tagId: "",
        tagName: "",
        tagVR: "",
        setTagId: mockSetTagId,
        setTagName: mockSetTagName,
        setTagVR: mockSetTagVR,
        addChanges: mockAddChanges,
        searchQuery: "",
        tags: sampleTags,
        pendingChanges: new Map(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the table with headers", () => {
        render(<TagDictionaryTable {...defaultProps} />);

        // Check headers
        expect(screen.getByText("Tag ID")).toBeInTheDocument();
        expect(screen.getByText("Tag VR")).toBeInTheDocument();
        expect(screen.getByText("Tag Name")).toBeInTheDocument();
    });

    it("displays pagination with correct count when there are more tags than display limit", () => {
        render(<TagDictionaryTable {...defaultProps} />);

        // Initial load should show 50 items
        const rows = screen.getAllByTestId(/^tag-row-/);
        expect(rows.length).toBe(50);

        // Should show load more button with correct count
        const loadMoreButton = screen.getByText(/Load More/);
        expect(loadMoreButton).toBeInTheDocument();
        expect(loadMoreButton.textContent).toContain("20 remaining");
    });

    it("loads more items when Load More button is clicked", () => {
        render(<TagDictionaryTable {...defaultProps} />);

        // Initially 50 items
        let rows = screen.getAllByTestId(/^tag-row-/);
        expect(rows.length).toBe(50);

        // Click load more
        fireEvent.click(screen.getByText(/Load More/));

        // Should now show all 70 items
        rows = screen.getAllByTestId(/^tag-row-/);
        expect(rows.length).toBe(70);

        // Load more button should be gone
        expect(screen.queryByText(/Load More/)).not.toBeInTheDocument();
    });

    it("filters tags based on search query for tag ID", () => {
        const { rerender } = render(<TagDictionaryTable {...defaultProps} />);

        // Search for a specific tag ID
        rerender(
            <TagDictionaryTable {...defaultProps} searchQuery="00100001" />
        );

        const rows = screen.getAllByTestId(/^tag-row-/);
        expect(rows.length).toBe(1);
        expect(screen.getByTestId("tag-row-00100001")).toBeInTheDocument();
    });

    it("filters tags based on search query for tag name", () => {
        const { rerender } = render(<TagDictionaryTable {...defaultProps} />);

        // Search for a tag name
        rerender(<TagDictionaryTable {...defaultProps} searchQuery="Tag 10" />);

        const rows = screen.getAllByTestId(/^tag-row-/);
        expect(rows.length).toBe(1);
        expect(screen.getByText("Tag 10")).toBeInTheDocument();
    });

    it("shows empty state message when no tags match search query", () => {
        render(
            <TagDictionaryTable
                {...defaultProps}
                searchQuery="NonExistentTag"
            />
        );

        expect(
            screen.getByText("No tags match your search query")
        ).toBeInTheDocument();
    });

    it("shows empty state message when there are no tags available", () => {
        render(<TagDictionaryTable {...defaultProps} tags={[]} />);

        expect(
            screen.getByText("No tags available. Add some tags to get started.")
        ).toBeInTheDocument();
    });

    it("renders add tag form when showAddTag is true", () => {
        render(<TagDictionaryTable {...defaultProps} showAddTag={true} />);

        // Check for input fields
        const tagIdInput = screen.getByPlaceholderText("Tag ID");
        const tagVRInput = screen.getByPlaceholderText("Tag VR");
        const tagNameInput = screen.getByPlaceholderText("Tag Name");

        expect(tagIdInput).toBeInTheDocument();
        expect(tagVRInput).toBeInTheDocument();
        expect(tagNameInput).toBeInTheDocument();

        // Check for confirm button
        expect(screen.getByTestId("CheckCircleIcon")).toBeInTheDocument();
    });

    it("calls appropriate callbacks when adding a new tag", () => {
        render(
            <TagDictionaryTable
                {...defaultProps}
                showAddTag={true}
                tagId="00100099"
                tagVR="CS"
            />
        );

        // Fill form fields
        const tagNameInput = screen.getByPlaceholderText("Tag Name");
        fireEvent.change(tagNameInput, { target: { value: "New Test Tag" } });

        // Click the confirm button
        fireEvent.click(screen.getByTestId("CheckCircleIcon"));

        // Check if callback was called with correct args
        expect(mockAddtag).toHaveBeenCalledWith("00100099", "CS");
        expect(mockSetTagName).toHaveBeenCalledWith("New Test Tag");
    });

    it("updates input fields when typing in add tag form", () => {
        render(<TagDictionaryTable {...defaultProps} showAddTag={true} />);

        // Type in fields
        const tagIdInput = screen.getByPlaceholderText("Tag ID");
        const tagVRInput = screen.getByPlaceholderText("Tag VR");
        const tagNameInput = screen.getByPlaceholderText("Tag Name");

        fireEvent.change(tagIdInput, { target: { value: "12345678" } });
        fireEvent.change(tagVRInput, { target: { value: "SQ" } });
        fireEvent.change(tagNameInput, { target: { value: "New Tag Name" } });

        // Check if setters were called
        expect(mockSetTagId).toHaveBeenCalledWith("12345678");
        expect(mockSetTagVR).toHaveBeenCalledWith("SQ");
        expect(mockSetTagName).toHaveBeenCalledWith("New Tag Name");
    });

    it("shows pending changes when they exist", () => {
        // Create a map with pending changes
        const pendingChanges = new Map();

        // Add a change (update)
        pendingChanges.set("00100001", {
            tagId: "00100001",
            name: "Updated Tag Name",
            vr: "PN",
        });

        // Add a deletion
        pendingChanges.set("00100002", {
            tagId: "00100002",
            name: "",
            vr: "LO",
            _delete: true,
        });

        render(
            <TagDictionaryTable
                {...defaultProps}
                pendingChanges={pendingChanges}
            />
        );

        // Check for pending update
        const updatedRow = screen.getByTestId("tag-row-00100001");
        const pendingValue = within(updatedRow).getByTestId("pending-value");
        expect(pendingValue).toBeInTheDocument();
        expect(pendingValue.textContent).toBe("Updated Tag Name");

        // Check for pending deletion
        const deletionRow = screen.getByTestId("tag-row-00100002");
        expect(
            within(deletionRow).getByTestId("pending-delete")
        ).toBeInTheDocument();
    });

    it("calls addChanges when a row edit button is clicked", () => {
        render(<TagDictionaryTable {...defaultProps} />);

        // Click edit on first row
        fireEvent.click(screen.getByTestId("edit-00100000"));

        // Check if addChanges was called correctly
        expect(mockAddChanges).toHaveBeenCalledWith(
            "00100000",
            "Edited Name",
            false
        );
    });

    it("calls addChanges when a row delete button is clicked", () => {
        render(<TagDictionaryTable {...defaultProps} />);

        // Click delete on first row
        fireEvent.click(screen.getByTestId("delete-00100000"));

        // Check if addChanges was called correctly
        expect(mockAddChanges).toHaveBeenCalledWith("00100000", "", true);
    });

    it("should handle case sensitivity in search correctly", () => {
        // Create sample with mixed case
        const mixedCaseTags = [
            { tagId: "00100001", name: "Patient Name", vr: "PN" },
            { tagId: "00100002", name: "PATIENT ID", vr: "LO" },
            { tagId: "00100003", name: "patient Address", vr: "LO" },
        ];

        const { rerender } = render(
            <TagDictionaryTable {...defaultProps} tags={mixedCaseTags} />
        );

        // Search with lowercase
        rerender(
            <TagDictionaryTable
                {...defaultProps}
                tags={mixedCaseTags}
                searchQuery="patient"
            />
        );

        // Should find all three tags
        const rows = screen.getAllByTestId(/^tag-row-/);
        expect(rows.length).toBe(3);

        // Search with uppercase
        rerender(
            <TagDictionaryTable
                {...defaultProps}
                tags={mixedCaseTags}
                searchQuery="PATIENT"
            />
        );

        // Should still find all three tags
        const rowsUppercase = screen.getAllByTestId(/^tag-row-/);
        expect(rowsUppercase.length).toBe(3);
    });
});
