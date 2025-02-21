import { render, fireEvent, screen } from "@testing-library/react";
import QuestionModal from "../../src/components/utils/QuestionModal";
import "@testing-library/jest-dom";

describe("QuestionModal component", () => {
    test("renders modal with correct title and text", () => {
        render(
            <QuestionModal
                setSeries={jest.fn()}
                setIsOpen={jest.fn()}
                title="Are you sure?"
                text="Do you want to proceed?"
            />
        );

        expect(screen.getByText("Are you sure?")).toBeInTheDocument();
        expect(screen.getByText("Do you want to proceed?")).toBeInTheDocument();
    });

    test("calls setSeries(true) and setIsOpen(false) when 'Yes' button is clicked", () => {
        const setSeriesMock = jest.fn();
        const setIsOpenMock = jest.fn();

        render(
            <QuestionModal
                setSeries={setSeriesMock}
                setIsOpen={setIsOpenMock}
                title="Are you sure?"
                text="Do you want to proceed?"
            />
        );

        const yesButton = screen.getByText("Yes");
        fireEvent.click(yesButton);

        expect(setSeriesMock).toHaveBeenCalledWith(true);
        expect(setIsOpenMock).toHaveBeenCalledWith(false);
    });

    test("calls setSeries(false) and setIsOpen(false) when 'No' button is clicked", () => {
        const setSeriesMock = jest.fn();
        const setIsOpenMock = jest.fn();

        render(
            <QuestionModal
                setSeries={setSeriesMock}
                setIsOpen={setIsOpenMock}
                title="Are you sure?"
                text="Do you want to proceed?"
            />
        );

        const noButton = screen.getByText("No");
        fireEvent.click(noButton);

        expect(setSeriesMock).toHaveBeenCalledWith(false);
        expect(setIsOpenMock).toHaveBeenCalledWith(false);
    });

    test("does not call setSeries or setIsOpen when clicking inside the modal", () => {
        const setSeriesMock = jest.fn();
        const setIsOpenMock = jest.fn();

        render(
            <QuestionModal
                setSeries={setSeriesMock}
                setIsOpen={setIsOpenMock}
                title="Are you sure?"
                text="Do you want to proceed?"
            />
        );

        const modalContent = screen.getByText("Are you sure?").closest("div");

        if (modalContent) {
            fireEvent.click(modalContent);

            expect(setSeriesMock).not.toHaveBeenCalled();
            expect(setIsOpenMock).not.toHaveBeenCalled();
        } else {
            throw new Error("Modal content not found");
        }
    });

    test("modal buttons are enabled and clickable", () => {
        const setSeriesMock = jest.fn();
        const setIsOpenMock = jest.fn();

        render(
            <QuestionModal
                setSeries={setSeriesMock}
                setIsOpen={setIsOpenMock}
                title="Are you sure?"
                text="Do you want to proceed?"
            />
        );

        const yesButton = screen.getByText("Yes");
        const noButton = screen.getByText("No");

        expect(yesButton).not.toBeDisabled();
        expect(noButton).not.toBeDisabled();

        fireEvent.click(yesButton);
        expect(setSeriesMock).toHaveBeenCalledTimes(1);
        fireEvent.click(noButton);
        expect(setIsOpenMock).toHaveBeenCalledTimes(2);
    });

    test("modal has correct background and styling", () => {
        const { container } = render(
            <QuestionModal
                setSeries={jest.fn()}
                setIsOpen={jest.fn()}
                title="Are you sure?"
                text="Do you want to proceed?"
            />
        );

        const modalBackground = container.querySelector(".fixed.inset-0");
        const modalContent = container.querySelector(".w-full.max-w-sm");

        expect(modalBackground).toHaveClass("bg-black");
        expect(modalBackground).toHaveClass("bg-opacity-50");
        expect(modalContent).toHaveClass("bg-white");
        expect(modalContent).toHaveClass("p-6");
    });
});
