import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Topbar from "../../src/components/Navigation/Topbar";

jest.mock("react-tooltip", () => ({
    Tooltip: () => <div>Tooltip</div>,
}));

describe("Topbar", () => {
    const mockToggleSidebar = jest.fn();
    const mockOnInstallClick = jest.fn();
    const sidebarButtonRef = React.createRef<HTMLButtonElement>();

    beforeEach(() => {
        mockToggleSidebar.mockClear();
        mockOnInstallClick.mockClear();
    });

    it("renders Topbar component", () => {
        render(
            <Topbar
                toggleSidebar={mockToggleSidebar}
                sidebarVisible={false}
                sidebarButtonRef={sidebarButtonRef}
                onInstallClick={mockOnInstallClick}
                showInstallButton={true}
            />
        );

        expect(screen.getByText("DICOM Tag Editor")).toBeInTheDocument();
    });

    it("renders Install App button when showInstallButton is true", () => {
        render(
            <Topbar
                toggleSidebar={mockToggleSidebar}
                sidebarVisible={false}
                sidebarButtonRef={sidebarButtonRef}
                onInstallClick={mockOnInstallClick}
                showInstallButton={true}
            />
        );

        expect(screen.getByText("Install App")).toBeInTheDocument();
    });

    it("does not render Install App button when showInstallButton is false", () => {
        render(
            <Topbar
                toggleSidebar={mockToggleSidebar}
                sidebarVisible={false}
                sidebarButtonRef={sidebarButtonRef}
                onInstallClick={mockOnInstallClick}
                showInstallButton={false}
            />
        );
        expect(screen.queryByText("Install App")).toBeNull();
    });

    it("calls onInstallClick when the Install App button is clicked", () => {
        render(
            <Topbar
                toggleSidebar={mockToggleSidebar}
                sidebarVisible={false}
                sidebarButtonRef={sidebarButtonRef}
                onInstallClick={mockOnInstallClick}
                showInstallButton={true}
            />
        );
        const installButton = screen.getByText("Install App");
        fireEvent.click(installButton);
        expect(mockOnInstallClick).toHaveBeenCalledTimes(1);
    });

    it("calls toggleSidebar when sidebar button is clicked", () => {
        render(
            <Topbar
                toggleSidebar={mockToggleSidebar}
                sidebarVisible={false}
                sidebarButtonRef={sidebarButtonRef}
                onInstallClick={mockOnInstallClick}
                showInstallButton={true}
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
                sidebarButtonRef={sidebarButtonRef}
                onInstallClick={mockOnInstallClick}
                showInstallButton={true}
            />
        );

        const icon = screen.getByRole("img", { hidden: true });
        expect(icon).toBeInTheDocument();
    });
});
