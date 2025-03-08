import { render, screen } from "@testing-library/react";
import FileHeader from "../../../../src/components/FileHandling/FileHeader";

describe("FileHeader Component", () => {
    test("renders correctly when files are provided", () => {
        const files = [{ name: "testFile1.dcm" }, { name: "testFile2.dcm" }];
        const currentFileIndex = 0;

        render(
            <FileHeader files={files} currentFileIndex={currentFileIndex} />
        );

        const headerText = screen.getByText("Currently Viewing: testFile1.dcm");
        expect(headerText).toBeInTheDocument();
    });

    test("does not render when no files are provided", () => {
        render(<FileHeader files={[]} currentFileIndex={0} />);

        const headerText = screen.queryByText(/Currently Viewing:/);
        expect(headerText).not.toBeInTheDocument();
    });
});
