import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TableControls } from "@features/DicomTagTable/Components/TableControls";
import { useStore } from "@state/Store";
import "@testing-library/jest-dom";

// Mock Zustand store hooks
jest.mock("@state/Store", () => {
    const actual = jest.requireActual("@state/Store");
    return {
        ...actual,
        useStore: jest.fn(),
    };
});

// Mock FormatData
jest.mock("@features/AutoAnonymize/Functions/AutoClean", () => ({
    FormatData: jest.fn(() => [
        { tagId: "X00100010", newValue: "AnonName" }
    ])
}));

// Mock TagDictionaryDB
jest.mock("@services/TagDictionaryDB", () => ({
    TagDictionaryDB: jest.fn().mockImplementation(() => ({
        getTag: jest.fn().mockResolvedValue({ name: "Mock Tag Name" })
    }))
}));

describe("TableControls", () => {
    const mockSetTags = jest.fn();
    const mockSetSidePanelVisible = jest.fn();
    const mockSetShowAddTag = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock Zustand store state
        (useStore as unknown as jest.Mock).mockImplementation((selector) =>
            selector({
                dicomData: [
                    {
                        DicomDataSet: { elements: { "x00100010": {} } },
                        tags: {},
                    }
                ],
                setTags: mockSetTags,
                tagsToAnon: [{ tagId: "X00100010", newValue: "AnonName" }],
                addTag: false,
                setShowAddTag: mockSetShowAddTag,
                setSidePanelVisible: mockSetSidePanelVisible,
            })
        );
    });

    test("renders the component with initial props", () => {
        render(
            <TableControls
                searchTerm=""
                onSearchChange={jest.fn()}
                onSave={jest.fn()}
            />
        );

        expect(screen.getByText("Download File")).toBeInTheDocument();
        expect(screen.getByText("Auto Anon")).toBeInTheDocument();
        expect(screen.getByText("Add Tag")).toBeInTheDocument();
    });

    test("calls onSearchChange when search term is changed", () => {
        const onSearchChange = jest.fn();
        render(
            <TableControls
                searchTerm=""
                onSearchChange={onSearchChange}
                onSave={jest.fn()}
            />
        );
        const searchInput = screen.getByPlaceholderText("Search tags...");
        fireEvent.change(searchInput, { target: { value: "test" } });
        expect(onSearchChange).toHaveBeenCalledWith("test");
    });

    test("calls onSave when Download File button is clicked", () => {
        const onSave = jest.fn();
        render(
            <TableControls
                searchTerm=""
                onSearchChange={jest.fn()}
                onSave={onSave}
            />
        );
        fireEvent.click(screen.getByText("Download File"));
        expect(onSave).toHaveBeenCalled();
    });

    test("calls Auto Anon logic and sets tags + opens side panel", async () => {
        render(
            <TableControls
                searchTerm=""
                onSearchChange={jest.fn()}
                onSave={jest.fn()}
            />
        );

        fireEvent.click(screen.getByText("Auto Anon"));

        await waitFor(() => {
            expect(mockSetTags).toHaveBeenCalledWith([
                {
                    tagId: "X00100010",
                    tagName: "Mock Tag Name",
                    newValue: "AnonName",
                },
            ]);
            expect(mockSetSidePanelVisible).toHaveBeenCalledWith(true);
        });
    });

    test("toggles add tag state when Add Tag button is clicked", () => {
        render(
            <TableControls
                searchTerm=""
                onSearchChange={jest.fn()}
                onSave={jest.fn()}
            />
        );

        const addTagBtn = screen.getByText("Add Tag");
        fireEvent.click(addTagBtn);
        expect(mockSetShowAddTag).toHaveBeenCalledWith(true);
    });
});
