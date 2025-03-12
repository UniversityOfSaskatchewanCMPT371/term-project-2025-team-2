import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import logger from "../../../../src/Logger/Logger";
import { ErrorBoundary } from "../../../../src/Components/ErrorHandling/ErrorBoundary";

jest.mock("../../../../src/Logger/Logger", () => ({
    error: jest.fn(),
}));

jest.mock("../../../../src/Components/ErrorHandling/GenErrorPage", () => ({
    __esModule: true,
    default: () => <div data-testid="gen-error-page">Error Page</div>,
}));

const ProblematicComponent: React.FC = () => {
    throw new Error("Test error");
};

describe("ErrorBoundary Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        console.error = jest.fn();
    });

    test("renders children when no error occurs", () => {
        render(
            <ErrorBoundary fallback={<div>Fallback Component</div>}>
                <div data-testid="child-component">Child Component</div>
            </ErrorBoundary>
        );
        expect(screen.getByTestId("child-component")).toBeInTheDocument();
    });

    test("renders GenErrorPage when an error is thrown", () => {
        render(
            <ErrorBoundary fallback={<div>Fallback Component</div>}>
                <ProblematicComponent />
            </ErrorBoundary>
        );

        expect(screen.getByTestId("gen-error-page")).toBeInTheDocument();
    });

    test("calls Logger.error when an error is caught", () => {
        render(
            <ErrorBoundary fallback={<div>Fallback Component</div>}>
                <ProblematicComponent />
            </ErrorBoundary>
        );

        expect(logger.error).toHaveBeenCalledWith(
            "Uncaught error:",
            expect.any(Error),
            expect.any(Object)
        );
    });

    test("logs error to console", () => {
        render(
            <ErrorBoundary fallback={<div>Fallback Component</div>}>
                <ProblematicComponent />
            </ErrorBoundary>
        );

        expect(console.error).toHaveBeenCalledWith(
            "ErrorBoundary:",
            expect.any(Error)
        );
        expect(console.error).toHaveBeenCalledWith(
            "Uncaught error:",
            expect.any(Error),
            expect.any(Object)
        );
    });
});
