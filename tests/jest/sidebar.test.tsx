import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "../../src/components/Navigation/Sidebar"
import { SidebarProps } from "../../src/types/types";

// Mock components
jest.mock("../../src/components/Navigation/NavigationLinks.tsx", () => ({
    NavigationLinks:()=><div data-testid="nav-links">Navigation Links</div>
}));
jest.mock("../../src/components/FileHandling/FileTable.tsx", () => (props:{onFileSelect:() => void}) => (
    <div data-testid="file-table" onClick={props.onFileSelect}>File Table</div>
));
jest.mock("../../src/components/utils/HelpIcon.tsx", () => (props: { onClick: () => void }) => (
  <button data-testid="help-icon" onClick={props.onClick}>?</button>
));
jest.mock("../../src/components/utils/Modal.tsx", () => (props: { isOpen: boolean; onClose: () => void }) => (
  props.isOpen ? <div data-testid="modal"><button onClick={props.onClose}>Close</button></div> : null
));

describe("Sidebar Component", () => {
  let props: SidebarProps;

  beforeEach(() => {
    props = {
      files: [new File(["content"], "test.dcm"), new File(["content"], "sample.dcm")],
      onFileSelect: jest.fn(),
      currentFileIndex: 0,
    };
  });

  test("renders sidebar correctly", () => {
    render(<Sidebar {...props} />);
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("nav-links")).toBeInTheDocument();
    expect(screen.getByTestId("file-table")).toBeInTheDocument();
  });

  test("calls onFileSelect when a file is clicked", () => {
    render(<Sidebar {...props} />);
    fireEvent.click(screen.getByTestId("file-table"));
    expect(props.onFileSelect).toHaveBeenCalled();
  });

  test("opens and closes the help modal", () => {
    render(<Sidebar {...props} />);
    fireEvent.click(screen.getByTestId("help-icon"));
    expect(screen.getByTestId("modal")).toBeInTheDocument();
    
    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });
});
