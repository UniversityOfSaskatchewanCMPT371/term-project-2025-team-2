import { render, screen } from "@testing-library/react";
import { LoadingScreen } from "../../../../src/components/utils/LoadingScreen";

describe("LoadingScreen", () => {
    it("renders the LoadingScreen component with the spinning icon", () => {
        render(<LoadingScreen />);

        const iconElement = screen.getByRole("img");

        expect(iconElement).toHaveClass(
            "fixed inset-0",
            "flex",
            "items-center",
            "justify-center",
            "bg-black",
            "bg-opacity-80"
        );
    });
});
