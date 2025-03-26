import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "../../../../src/Components/Navigation/Header";
import "@testing-library/jest-dom";

jest.mock("@logger/Logger", () => ({
    debug: jest.fn(),
  }));
  
  describe("Header Component", () => {
    it("renders the header and handles settings icon click", () => {
      const toggleModalMock = jest.fn();
  
      render(<Header toggleModal={toggleModalMock} />);
  
      expect(screen.getByText("Files")).toBeInTheDocument();

      const settingsIcon = screen.getByLabelText("Settings Button");
      expect(settingsIcon).toBeInTheDocument();
  
      expect(settingsIcon).toHaveAttribute("data-tooltip-id", "settings-button-tooltip");
      expect(settingsIcon).toHaveAttribute("data-tooltip-content", "Settings");
  
      fireEvent.click(settingsIcon);
      expect(toggleModalMock).toHaveBeenCalledTimes(1);
    });
  });