import { render, fireEvent, screen } from "@testing-library/react";
import { QuestionModal } from "@components/utils/Modals/QuestionModal";
import { useQuestionModalStore } from "@state/QuestionModalStore";
import "@testing-library/jest-dom";

// Mock the Zustand store
jest.mock("@state/QuestionModalStore", () => ({
    useQuestionModalStore: jest.fn(),
}));

describe("QuestionModal component", () => {
    const mockOnConfirm = jest.fn();
    const mockOnCancel = jest.fn();
    const mockCloseModal = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup default mock implementation
        (useQuestionModalStore as unknown as jest.Mock).mockImplementation(
            () => ({
                isOpen: true,
                title: "Test Title",
                text: "Test Text",
                onConfirm: mockOnConfirm,
                onCancel: mockOnCancel,
                closeModal: mockCloseModal,
            })
        );
    });

    test("renders modal with correct title and text", () => {
        render(<QuestionModal />);

        expect(screen.getByText("Test Title")).toBeInTheDocument();
        expect(screen.getByText("Test Text")).toBeInTheDocument();
    });

    test("calls onConfirm and closeModal when 'Yes' button is clicked", () => {
        render(<QuestionModal />);

        const yesButton = screen.getByText("Yes");
        fireEvent.click(yesButton);

        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
        expect(mockCloseModal).toHaveBeenCalledTimes(1);
    });

    test("calls onCancel and closeModal when 'No' button is clicked", () => {
        render(<QuestionModal />);

        const noButton = screen.getByText("No");
        fireEvent.click(noButton);

        expect(mockOnCancel).toHaveBeenCalledTimes(1);
        expect(mockCloseModal).toHaveBeenCalledTimes(1);
    });

    test("doesn't render when isOpen is false", () => {
        (useQuestionModalStore as unknown as jest.Mock).mockImplementation(
            () => ({
                isOpen: false,
                title: "Test Title",
                text: "Test Text",
                onConfirm: mockOnConfirm,
                onCancel: mockOnCancel,
                closeModal: mockCloseModal,
            })
        );

        const { container } = render(<QuestionModal />);
        expect(container).toBeEmptyDOMElement();
    });

    test("modal buttons are enabled and clickable", () => {
        render(<QuestionModal />);

        const yesButton = screen.getByText("Yes");
        const noButton = screen.getByText("No");

        expect(yesButton).not.toBeDisabled();
        expect(noButton).not.toBeDisabled();

        fireEvent.click(yesButton);
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
        expect(mockCloseModal).toHaveBeenCalledTimes(1);

        fireEvent.click(noButton);
        expect(mockOnCancel).toHaveBeenCalledTimes(1);
        expect(mockCloseModal).toHaveBeenCalledTimes(2);
    });

    test("modal has correct background and styling", () => {
        const { container } = render(<QuestionModal />);

        const modalBackground = container.querySelector(".fixed.inset-0");
        const modalContent = container.querySelector(".w-full.max-w-sm");

        expect(modalBackground).toHaveClass("bg-black");
        expect(modalBackground).toHaveClass("bg-opacity-50");
        expect(modalContent).toHaveClass("bg-white");
        expect(modalContent).toHaveClass("p-6");
        expect(modalBackground).toHaveClass("z-[9999]");
    });

    //   test("event propagation is stopped when clicking inside modal content", () => {
    //     const { container } = render(<QuestionModal />);

    //     const modalContent = container.querySelector(".w-full.max-w-sm");
    //     if (modalContent) {
    //       const mockStopPropagation = jest.fn();
    //       fireEvent.click(modalContent, { stopPropagation: mockStopPropagation });

    //       // This verifies the e.stopPropagation() was called
    //       expect(mockStopPropagation).toHaveBeenCalled();

    //       // Also verify the callbacks weren't called by this click
    //       expect(mockOnConfirm).not.toHaveBeenCalled();
    //       expect(mockOnCancel).not.toHaveBeenCalled();
    //     }
    //   });
});
