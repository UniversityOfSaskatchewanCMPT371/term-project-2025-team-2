import { render, fireEvent, screen } from "@testing-library/react";
import { Modal } from "../../../../src/Components/utils/Modals/Modal";
import "@testing-library/jest-dom";

describe("Modal component", () => {
    test("does not render when isOpen is false", () => {
        render(
            <Modal
                isOpen={false}
                onClose={() => {}}
                title="Test Title"
                text="Test Text"
            />
        );
        const modal = screen.queryByText("Test Title");
        expect(modal).toBeNull();
    });

    test("renders modal when isOpen is true", () => {
        render(
            <Modal
                isOpen={true}
                onClose={() => {}}
                title="Test Title"
                text="Test Text"
            />
        );
        const modal = screen.getByText("Test Title");
        expect(modal).toBeInTheDocument();
        expect(screen.getByText("Test Text")).toBeInTheDocument();
    });

    test("calls onClose when close button is clicked", () => {
        const onCloseMock = jest.fn();
        render(
            <Modal
                isOpen={true}
                onClose={onCloseMock}
                title="Test Title"
                text="Test Text"
            />
        );
        const closeButton = screen.getByText("Close");
        fireEvent.click(closeButton);
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    test("calls onClose when clicking outside the modal", () => {
        const onCloseMock = jest.fn();
        render(
            <Modal
                isOpen={true}
                onClose={onCloseMock}
                title="Test Title"
                text="Test Text"
            />
        );
        const modalBackground = screen.getByRole("dialog");
        fireEvent.click(modalBackground);
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    test("does not call onClose when clicking inside the modal", () => {
        const onCloseMock = jest.fn();
        render(
            <Modal
                isOpen={true}
                onClose={onCloseMock}
                title="Test Title"
                text="Test Text"
            />
        );

        const modalTitle = screen.getByText("Test Title");
        const modalContent = modalTitle.closest("div");

        if (modalContent) {
            fireEvent.click(modalContent);
            expect(onCloseMock).not.toHaveBeenCalled();
        } else {
            throw new Error("Modal content not found");
        }
    });

    test("has correct modal title and text", () => {
        render(
            <Modal
                isOpen={true}
                onClose={() => {}}
                title="Test Title"
                text="Test Text"
            />
        );
        const modalTitle = screen.getByText("Test Title");
        const modalText = screen.getByText("Test Text");
        expect(modalTitle).toBeInTheDocument();
        expect(modalText).toBeInTheDocument();
    });

    test("applies correct styles when modal is open", () => {
        const { container } = render(
            <Modal
                isOpen={true}
                onClose={() => {}}
                title="Test Title"
                text="Test Text"
            />
        );
        const modalBackground = container.querySelector(".fixed.inset-0");
        const modalContent = container.querySelector(".w-full.max-w-sm");

        expect(modalBackground).toHaveClass("bg-black");
        expect(modalBackground).toHaveClass("bg-opacity-50");

        expect(modalContent).toHaveClass("bg-white");
        expect(modalContent).toHaveClass("p-6");
    });

    test("does not render modal if isOpen is false", () => {
        const { container } = render(
            <Modal
                isOpen={false}
                onClose={() => {}}
                title="Test Title"
                text="Test Text"
            />
        );
        const modalBackground = container.querySelector(".fixed.inset-0");
        expect(modalBackground).toBeNull();
    });
});
