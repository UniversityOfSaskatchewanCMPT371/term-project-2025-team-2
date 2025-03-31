import { render, screen, fireEvent } from "@testing-library/react";
import AutoAnonTagsEdit from "@components/Navigation/AutoAnonTagsEdit";
import { useStore } from "@state/Store";

// Mock Zustand store
jest.mock("@state/Store", () => ({
    useStore: jest.fn(),
}));

// Mock tag data
const mockTagsToAnon = [
    { tagId: "X00100010", name: "PatientName", value: "Anon" },
    { tagId: "X00100020", name: "PatientID", value: "12345" },
];

// Setup mock functions
const mockSetTagsToAnon = jest.fn();
const mockResetTagsAnon = jest.fn();
const mockSetShowAlert = jest.fn();
const mockSetAlertMsg = jest.fn();
const mockSetAlertType = jest.fn();
const mockSetAutoAnonTagsEditPanelVisible = jest.fn();

beforeEach(() => {
    (useStore as unknown as jest.Mock).mockImplementation((selector) =>
        selector({
            tagsToAnon: mockTagsToAnon,
            setTagsToAnon: mockSetTagsToAnon,
            resetTagsAnon: mockResetTagsAnon,
            setShowAlert: mockSetShowAlert,
            setAlertMsg: mockSetAlertMsg,
            setAlertType: mockSetAlertType,
            autoAnonTagsEditPanelVisible: true,
            setAutoAnonTagsEditPanelVisible: mockSetAutoAnonTagsEditPanelVisible,
        })
    );

    jest.clearAllMocks();
});

describe("AutoAnonTagsEdit", () => {
    it("renders the component and tag rows", () => {
        render(<AutoAnonTagsEdit />);
        expect(screen.getByText("Tags in Anonymize List")).toBeInTheDocument();
        expect(screen.getByText("PatientName")).toBeInTheDocument();
        expect(screen.getByText("PatientID")).toBeInTheDocument();
    });

    it("toggles add tag input row when 'Add Anon Tag' is clicked", () => {
        render(<AutoAnonTagsEdit />);
        const addBtn = screen.getByTestId("AutoAnonAddTag");
        fireEvent.click(addBtn);
        expect(screen.getByPlaceholderText("Tag ID")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Tag Value")).toBeInTheDocument();
    });

    it("validates input when saving tag with invalid tagId", () => {
        render(<AutoAnonTagsEdit />);
        fireEvent.click(screen.getByTestId("AutoAnonAddTag"));
        fireEvent.change(screen.getByPlaceholderText("Tag ID"), {
            target: { value: "123" },
        });
        fireEvent.change(screen.getByPlaceholderText("Tag Value"), {
            target: { value: "AnonValue" },
        });
        fireEvent.click(screen.getByTestId("CheckCircleIcon"));

        expect(mockSetAlertType).toHaveBeenCalledWith("alert-error");
        expect(mockSetAlertMsg).toHaveBeenCalledWith("Tag ID has to be 8 numbers");
        expect(mockSetShowAlert).toHaveBeenCalledWith(true);
    });
    it("validates empty tag value", () => {
        render(<AutoAnonTagsEdit />);
        fireEvent.click(screen.getByTestId("AutoAnonAddTag"));
    
        fireEvent.change(screen.getByPlaceholderText("Tag ID"), {
            target: { value: "00100010" },
        });
    
        // Simulate auto-filling tagName via filterTagName
        fireEvent.change(screen.getByPlaceholderText("Tag Value"), {
            target: { value: "" }, // explicitly empty
        });
    
        fireEvent.click(screen.getByTestId("CheckCircleIcon"));
    
        expect(mockSetAlertMsg).toHaveBeenCalledWith("Tag Value can't be empty");
        expect(mockSetAlertType).toHaveBeenCalledWith("alert-error");
        expect(mockSetShowAlert).toHaveBeenCalledWith(true);
    });
    
    it("accepts 'Unknown' tag name for unknown tagId", () => {
        render(<AutoAnonTagsEdit />);
        fireEvent.click(screen.getByTestId("AutoAnonAddTag"));
    
        fireEvent.change(screen.getByPlaceholderText("Tag ID"), {
            target: { value: "00000000" }, // unknown tagId
        });
    
        fireEvent.change(screen.getByPlaceholderText("Tag Value"), {
            target: { value: "AnonValue" },
        });
    
        fireEvent.click(screen.getByTestId("CheckCircleIcon"));
    
        expect(mockSetAlertMsg).not.toHaveBeenCalledWith("Tag Name can't be empty");
    });
    
    it("closes panel on Cancel", () => {
        render(<AutoAnonTagsEdit />);
        fireEvent.click(screen.getByText("Cancel"));
        expect(mockSetAutoAnonTagsEditPanelVisible).toHaveBeenCalledWith(false);
    });

    it("resets the tags when 'Reset Tags' is clicked", () => {
        render(<AutoAnonTagsEdit />);
        fireEvent.click(screen.getByText("Reset Tags"));
        expect(mockResetTagsAnon).toHaveBeenCalled();
    });

    it("saves changes when 'Save' is clicked without pending add", () => {
        render(<AutoAnonTagsEdit />);
        fireEvent.click(screen.getByText("Save"));

        expect(mockSetAlertMsg).toHaveBeenCalledWith("No Changes Made");
        expect(mockSetAlertType).toHaveBeenCalledWith("alert-warning");
        expect(mockSetAutoAnonTagsEditPanelVisible).toHaveBeenCalledWith(false);
    });

    it("prevents save if add tag is still open", () => {
        render(<AutoAnonTagsEdit />);
        fireEvent.click(screen.getByTestId("AutoAnonAddTag"));
        fireEvent.click(screen.getByText("Save"));

        expect(mockSetAlertMsg).toHaveBeenCalledWith(
            "Add tag isn't saved yet, please save or cancel it first"
        );
        expect(mockSetAlertType).toHaveBeenCalledWith("alert-error");
    });
});
