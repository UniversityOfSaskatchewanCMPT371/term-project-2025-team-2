import { render, screen } from "@testing-library/react";
import Footer from "@components/Navigation/Footer";

describe("Footer", () => {
    it("renders the footer element", () => {
        render(<Footer />);
        const footer = screen.getByRole("contentinfo");
        expect(footer).toBeInTheDocument();
    });

    it("renders the correct text content", () => {
        render(<Footer />);
        const footerText = screen.getByText(
            /© 2025 University of Saskatchewan - CMPT 371 Team 2 - All rights reserved./
        );
        expect(footerText).toBeInTheDocument();
    });

    it("renders the correct link with the correct href", () => {
        render(<Footer />);
        const link = screen.getByRole("link");
        expect(link).toHaveAttribute(
            "href",
            "https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2025-team-2"
        );
        expect(link).toHaveTextContent(
            "© 2025 University of Saskatchewan - CMPT 371 Team 2 - All rights reserved."
        );
    });

    it("applies the correct class names to the footer element", () => {
        render(<Footer />);
        const footer = screen.getByRole("contentinfo");
        expect(footer).toHaveClass(
            "z-10 mt-4 bg-primary p-4 text-center text-white"
        );
    });
});
