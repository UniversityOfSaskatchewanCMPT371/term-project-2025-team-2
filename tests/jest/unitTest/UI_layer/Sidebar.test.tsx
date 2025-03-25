import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { createElement } from "react";
import { Sidebar } from "../../../../src/Components/Navigation/Sidebar";
import { useStore } from "../../../../src/State/Store";

// Mock the store
jest.mock("../../../../src/State/Store", () => ({
    useStore: jest.fn(),
}));

// Mock child components
jest.mock("../../../../src/Components/Navigation/Header", () => ({
    Header: ({ toggleModal }: { toggleModal: () => void }) =>
        createElement(
            "div",
            {
                "data-testid": "mock-header",
                onClick: toggleModal,
            },
            "Header"
        ),
}));

jest.mock("../../../../src/Components/Navigation/SeriesControls", () => ({
    SeriesControls: () =>
        createElement(
            "div",
            {
                "data-testid": "mock-series-controls",
            },
            "Series Controls"
        ),
}));

jest.mock("../../../../src/Components/Navigation/SettingsModal", () => ({
    SettingsModal: () =>
        createElement(
            "div",
            {
                "data-testid": "mock-settings-modal",
            },
            "Settings Modal"
        ),
}));

jest.mock("../../../../src/Features/FileHandling/Components/FileTable", () => ({
    FileTable: () =>
        createElement(
            "div",
            {
                "data-testid": "mock-file-table",
            },
            "File Table"
        ),
}));

jest.mock("../../../../src/Components/utils/Modals/HelpModal", () => ({
    HelpModal: () =>
        createElement(
            "div",
            {
                "data-testid": "mock-help-modal",
            },
            "Help Modal"
        ),
}));

describe("Sidebar", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Setup default store mock
        (useStore as unknown as jest.Mock).mockImplementation(
            (selector: any) => {
                const state = {
                    files: [{ name: "file1" }, { name: "file2" }],
                };
                return selector(state);
            }
        );
    });

    it("renders when visible", () => {
        const { container } = render(
            createElement(Sidebar, { isVisible: true })
        );

        const sidebar = container.firstChild as HTMLElement;
        expect(sidebar).toHaveClass("translate-x-0");
        expect(sidebar).not.toHaveClass("translate-x-full");

        expect(screen.getByTestId("mock-header")).toBeInTheDocument();
        expect(screen.getByTestId("mock-series-controls")).toBeInTheDocument();
        expect(screen.getByTestId("mock-file-table")).toBeInTheDocument();
        expect(screen.getByTestId("mock-help-modal")).toBeInTheDocument();
    });

    it("is hidden when not visible", () => {
        const { container } = render(
            createElement(Sidebar, { isVisible: false })
        );

        const sidebar = container.firstChild as HTMLElement;
        expect(sidebar).toHaveClass("translate-x-full");
        expect(sidebar).not.toHaveClass("translate-x-0");
    });

    it("shows settings modal when toggleModal is called", () => {
        render(createElement(Sidebar, { isVisible: true }));

        // settings modal should not be visible initially
        expect(
            screen.queryByTestId("mock-settings-modal")
        ).not.toBeInTheDocument();

        // simulate Header component calling toggleModal
        const header = screen.getByTestId("mock-header");
        fireEvent.click(header);

        // settings modal should be visible now
        expect(screen.getByTestId("mock-settings-modal")).toBeInTheDocument();
    });

    it("applies correct CSS classes based on visibility", () => {
        const { container, rerender } = render(
            createElement(Sidebar, { isVisible: true })
        );
        const sidebar = container.firstChild as HTMLElement;
        expect(sidebar).toHaveClass("translate-x-0");

        rerender(createElement(Sidebar, { isVisible: false }));
        expect(sidebar).toHaveClass("translate-x-full");
    });
});
