import { render, screen } from "@testing-library/react";
import HelpModal from "../../src/components/utils/Modals/HelpModal";

describe("HelpModal", () => {
    it("renders the HelpModal component with the correct content", () => {
        render(<HelpModal />);

        expect(screen.getByText("Help")).toBeInTheDocument();

        expect(
            screen.getByText("Dicom tag Editor Options")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Edit tag values or remove tags")
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "Toggle between editing files individually or as a series"
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText("Download files as a zip or individual files")
        ).toBeInTheDocument();

        expect(screen.getByText("Detailed User Guide")).toHaveAttribute(
            "href",
            "https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2025-team-2"
        );
    });

    // TODO: Fix this test
    // it("closes the modal when the 'Close' button is clicked", () => {
    //     render(<HelpModal />);

    //     const helpModal = screen.getByRole("dialog");

    //     helpModal.setAttribute('open', 'true');

    //     expect(helpModal).toBeInTheDocument();

    //     const closeButton = screen.getByRole("button", { name: /close/i });
    //     fireEvent.click(closeButton);

    //     expect(helpModal).not.toBeInTheDocument();
    // });
});
