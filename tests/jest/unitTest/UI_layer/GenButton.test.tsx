import { render, fireEvent, screen } from "@testing-library/react";
import { GenButton } from "../../../../src/Components/utils/GenButton";
import "@testing-library/jest-dom";

describe("GenButton component", () => {
    test("renders button with correct label", () => {
        render(
            <GenButton label="Click Me" onClick={() => {}} disabled={false} />
        );
        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent("Click Me");
    });

    test("fires onClick handler when clicked", () => {
        const onClickMock = jest.fn();
        render(
            <GenButton
                label="Click Me"
                onClick={onClickMock}
                disabled={false}
            />
        );
        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    test("does not fire onClick handler when button is disabled", () => {
        const onClickMock = jest.fn();
        render(
            <GenButton label="Click Me" onClick={onClickMock} disabled={true} />
        );
        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(onClickMock).not.toHaveBeenCalled();
    });

    test("button is disabled when disabled prop is true", () => {
        render(
            <GenButton label="Click Me" onClick={() => {}} disabled={true} />
        );
        const button = screen.getByRole("button");
        expect(button).toBeDisabled();
    });

    test("button is enabled when disabled prop is false", () => {
        render(
            <GenButton label="Click Me" onClick={() => {}} disabled={false} />
        );
        const button = screen.getByRole("button");
        expect(button).not.toBeDisabled();
    });

    test("button has correct class when disabled", () => {
        const { container } = render(
            <GenButton label="Click Me" onClick={() => {}} disabled={true} />
        );
        const button = container.querySelector("button");
        expect(button).toHaveClass("disabled:bg-base-300");
    });

    test("button has correct class when enabled", () => {
        const { container } = render(
            <GenButton label="Click Me" onClick={() => {}} disabled={false} />
        );
        const button = container.querySelector("button");
        expect(button).toHaveClass("bg-primary");
    });
});
