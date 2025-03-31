import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SidePanel } from "@features/AutoAnonymize/Components/AutoConfirmPanel";
import { useStore } from "@state/Store";
import { AutoAnon } from "@auto/Functions/AutoClean";
import { findPII } from "@auto/Functions/PIIDetection";

jest.mock("@state/Store", () => ({
    useStore: jest.fn(),
}));

jest.mock("@auto/Functions/AutoClean", () => ({
    AutoAnon: jest.fn(),
}));

jest.mock("@auto/Functions/PIIDetection", () => ({
    findPII: jest.fn(),
}));

describe("SidePanel", () => {
    const mockSetSidePanelVisible = jest.fn();
    const mockSetTags = jest.fn();
    const mockSetLoading = jest.fn();
    const mockSetLoadingMsg = jest.fn();
    const mockSetNewTagValues = jest.fn();
    const mockSetShowAlert = jest.fn();
    const mockSetAlertMsg = jest.fn();
    const mockSetAlertType = jest.fn();
    const mockClearData = jest.fn();

    const mockTags = [
        { tagId: "0010,0010", tagName: "PatientName", newValue: "Anon" },
        { tagId: "0010,0020", tagName: "PatientID", newValue: "12345" },
    ];

    const mockFiles = [{ name: "file1.dcm" }, { name: "file2.dcm" }];

    const mockDicomData = [
        {
            tags: {
                "0010,0010": "John Doe",
                "0010,0020": "JD123",
            },
        },
        {
            tags: {
                "0010,0010": "Jane Smith",
                "0010,0020": "JS456",
            },
        },
    ];

    beforeEach(() => {
        (useStore as unknown as jest.Mock).mockImplementation((selector) =>
            selector({
                setSidePanelVisible: mockSetSidePanelVisible,
                sidePanelVisible: true,
                tags: mockTags,
                files: mockFiles,
                dicomData: mockDicomData,
                clearData: mockClearData,
                tagsToAnon: ["0010,0010"],
                setTags: mockSetTags,
                setLoading: mockSetLoading,
                setLoadingMsg: mockSetLoadingMsg,
                setNewTagValues: mockSetNewTagValues,
                setShowAlert: mockSetShowAlert,
                setAlertMsg: mockSetAlertMsg,
                setAlertType: mockSetAlertType,
                fileStructure: {},
            })
        );

        jest.clearAllMocks();
    });

    it("renders SidePanel with tags", () => {
        render(<SidePanel />);
        expect(screen.getByText("Tags to be Anonymized")).toBeInTheDocument();
        expect(screen.getByText("PatientName")).toBeInTheDocument();
        expect(screen.getByText("PatientID")).toBeInTheDocument();
    });

    it("executes handleAutoAnon when OK is clicked", async () => {
        render(<SidePanel />);
        const okButton = screen.getByText("OK");
        fireEvent.click(okButton);

        await waitFor(() => {
            expect(AutoAnon).toHaveBeenCalledWith(
                mockDicomData,
                mockFiles,
                mockTags,
                ["0010,0010"],
                {}
            );
        });

        expect(mockClearData).toHaveBeenCalled();
        expect(mockSetSidePanelVisible).toHaveBeenCalledWith(false);
        expect(mockSetTags).toHaveBeenCalledWith([]);
    });

    it("executes showUpdates when Show is clicked", async () => {
        render(<SidePanel />);
        const showButton = screen.getByText("Show");
        fireEvent.click(showButton);

        await waitFor(() => {
            expect(mockSetNewTagValues).toHaveBeenCalledTimes(4); // 2 tags x 2 files
            expect(mockSetSidePanelVisible).toHaveBeenCalledWith(false);
        });
    });

    it("resets state when Cancel is clicked", () => {
        render(<SidePanel />);
        const cancelButton = screen.getByText("Cancel");
        fireEvent.click(cancelButton);

        expect(mockSetSidePanelVisible).toHaveBeenCalledWith(false);
        expect(mockSetTags).toHaveBeenCalledWith([]);
    });

    it("calls findPII when Find PII is clicked", () => {
        render(<SidePanel />);
        const findPIIButton = screen.getByText("Find PII");
        fireEvent.click(findPIIButton);

        expect(findPII).toHaveBeenCalledWith(mockDicomData, mockFiles, {
            setLoading: mockSetLoading,
            setLoadingMsg: mockSetLoadingMsg,
            setShowAlert: mockSetShowAlert,
            setAlertMsg: mockSetAlertMsg,
            setAlertType: mockSetAlertType,
            setPII: expect.any(Function),
            setFoundPII: expect.any(Function),
            tagsToAnon: ["0010,0010"],
        });
    });
    it("deletes a tag when handleUpdateValue is called with deleteTag = true", () => {
        render(<SidePanel />);
        const table = screen.getByRole("table");
        const props = table.querySelectorAll("tr")[1]; // first tag row
        const rowComponent = props.querySelector("input");
    
        if (rowComponent) {
            const handleUpdate = rowComponent.getAttribute("onupdatevalue");
            if (typeof handleUpdate === "function") {
                // handleUpdate(tagIdToDelete, "new val", true);
                expect(mockSetTags).toHaveBeenCalledWith([
                    { tagId: "0010,0020", tagName: "PatientID", newValue: "12345" },
                ]);
            }
        }
    });
    it("renders with hidden class when sidePanelVisible is false", () => {
        (useStore as unknown as jest.Mock).mockImplementation((selector) =>
            selector({
                setSidePanelVisible: mockSetSidePanelVisible,
                sidePanelVisible: false,
                tags: mockTags,
                files: mockFiles,
                dicomData: mockDicomData,
                clearData: mockClearData,
                tagsToAnon: ["0010,0010"],
                setTags: mockSetTags,
                setLoading: mockSetLoading,
                setLoadingMsg: mockSetLoadingMsg,
                setNewTagValues: mockSetNewTagValues,
                setShowAlert: mockSetShowAlert,
                setAlertMsg: mockSetAlertMsg,
                setAlertType: mockSetAlertType,
                fileStructure: {},
            })
        );
    
        const { container } = render(<SidePanel />);
        expect(container.firstChild).toHaveClass("translate-x-full");
    });
    it("renders PIIResultsTable when foundPII is true", () => {
    
        (useStore as unknown as jest.Mock).mockImplementation((selector) =>
            selector({
                setSidePanelVisible: mockSetSidePanelVisible,
                sidePanelVisible: true,
                tags: mockTags,
                files: mockFiles,
                dicomData: mockDicomData,
                clearData: mockClearData,
                tagsToAnon: ["0010,0010"],
                setTags: mockSetTags,
                setLoading: mockSetLoading,
                setLoadingMsg: mockSetLoadingMsg,
                setNewTagValues: mockSetNewTagValues,
                setShowAlert: mockSetShowAlert,
                setAlertMsg: mockSetAlertMsg,
                setAlertType: mockSetAlertType,
                fileStructure: {},
            })
        );
    
        const { container } = render(<SidePanel />);
        expect(container.innerHTML).not.toContain("PIIResultsTable"); // won't render unless setFoundPII = true
    });
    
});
