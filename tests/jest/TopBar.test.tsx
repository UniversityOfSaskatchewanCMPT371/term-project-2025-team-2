import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Topbar from "../../src/components/Navigation/Topbar";

jest.mock("react-tooltip", () => ({
    Tooltip: () => <div>Tooltip</div>,
}));

jest.mock("../../src/components/Navigation/ThemeSelector", () => ({
    ThemeSelector: ({ toggleTheme, currTheme }: any) => (
        <div onClick={toggleTheme}>Current Theme: {currTheme}</div>
    ),
}));

describe("Topbar", () => {
    const mockToggleSidebar = jest.fn();
    const mockToggleTheme = jest.fn();
    const mockOnInstallClick = jest.fn();
    const sidebarButtonRef = React.createRef<HTMLButtonElement>();

    beforeEach(() => {
        mockToggleSidebar.mockClear();
        mockToggleTheme.mockClear();
        mockOnInstallClick.mockClear();
    });

    it("renders Topbar component", () => {
        render(
            <Topbar
                toggleSidebar={mockToggleSidebar}
                sidebarVisible={false}
                toggleTheme={mockToggleTheme}
                sidebarButtonRef={sidebarButtonRef}
                onInstallClick={mockOnInstallClick}
                showInstallButton={true}
                currTheme="day"
            />
        );

        expect(screen.getByText("DICOM Tag Editor")).toBeInTheDocument();
    });

    it("renders Install App button when showInstallButton is true", () => {
        render(
            <Topbar
                toggleSidebar={mockToggleSidebar}
                sidebarVisible={false}
                toggleTheme={mockToggleTheme}
                sidebarButtonRef={sidebarButtonRef}
                onInstallClick={mockOnInstallClick}
                showInstallButton={true}
                currTheme="day"
            />
        );

        expect(screen.getByText("Install App")).toBeInTheDocument();
    });

    it("does not render Install App button when showInstallButton is false", () => {
        render(
            <Topbar
                toggleSidebar={mockToggleSidebar}
                sidebarVisible={false}
                toggleTheme={mockToggleTheme}
                sidebarButtonRef={sidebarButtonRef}
                onInstallClick={mockOnInstallClick}
                showInstallButton={false}
                currTheme="day"
            />
        );
        expect(screen.queryByText("Install App")).toBeNull();
    });

    it("calls onInstallClick when the Install App button is clicked", () => {
        render(
            <Topbar
                toggleSidebar={mockToggleSidebar}
                sidebarVisible={false}
                toggleTheme={mockToggleTheme}
                sidebarButtonRef={sidebarButtonRef}
                onInstallClick={mockOnInstallClick}
                showInstallButton={true}
                currTheme="day"
            />
        );
        const installButton = screen.getByText("Install App");
        fireEvent.click(installButton);
        expect(mockOnInstallClick).toHaveBeenCalledTimes(1);
    });

    it("renders ThemeSelector component with correct theme", () => {
        render(
            <Topbar
                toggleSidebar={mockToggleSidebar}
                sidebarVisible={false}
                toggleTheme={mockToggleTheme}
                sidebarButtonRef={sidebarButtonRef}
                onInstallClick={mockOnInstallClick}
                showInstallButton={true}
                currTheme="night"
            />
        );

        expect(screen.getByText("Current Theme: night")).toBeInTheDocument();
    });

    it("calls toggleTheme when ThemeSelector is clicked", () => {
        render(
            <Topbar
                toggleSidebar={mockToggleSidebar}
                sidebarVisible={false}
                toggleTheme={mockToggleTheme}
                sidebarButtonRef={sidebarButtonRef}
                onInstallClick={mockOnInstallClick}
                showInstallButton={true}
                currTheme="day"
            />
        );
        const themeSelector = screen.getByText("Current Theme: day");
        fireEvent.click(themeSelector);
        expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    it("calls toggleSidebar when sidebar button is clicked", () => {
        render(
            <Topbar
                toggleSidebar={mockToggleSidebar}
                sidebarVisible={false}
                toggleTheme={mockToggleTheme}
                sidebarButtonRef={sidebarButtonRef}
                onInstallClick={mockOnInstallClick}
                showInstallButton={true}
                currTheme="day"
            />
        );
        const sidebarButton = screen.getByTestId("sidebar-toggle-button");
        fireEvent.click(sidebarButton);
        expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
    });

    it("renders the correct icon for the sidebar button", () => {
        render(
            <Topbar
                toggleSidebar={mockToggleSidebar}
                sidebarVisible={false}
                toggleTheme={mockToggleTheme}
                sidebarButtonRef={sidebarButtonRef}
                onInstallClick={mockOnInstallClick}
                showInstallButton={true}
                currTheme="day"
            />
        );

        const icon = screen.getByRole("img", { hidden: true });
        expect(icon).toBeInTheDocument();
    });
});
