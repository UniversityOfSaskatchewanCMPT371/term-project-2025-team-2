import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import Logger from "../../src/components/utils/Logger";
import ErrorBoundary from "../../src/components/ErrorHandling/ErrorBoundary";

// Mock Logger before importing ErrorBoundary
jest.mock("../../src/components/utils/Logger", () => ({
    error: jest.fn(),
}));

// Mock GenErrorPage before importing ErrorBoundary
jest.mock("../../src/components/ErrorHandling/GenErrorPage", () => ({
    __esModule: true,
    default: () => <div data-testid="gen-error-page">Error Page</div>,
}));

// Component to simulate an error
const ProblematicComponent: React.FC = () => {
    throw new Error("Test error");
};

describe("ErrorBoundary Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        console.error = jest.fn(); // Mock console.error globally
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

        expect(Logger.error).toHaveBeenCalledWith(
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
