import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; 
import { AlertHeader } from "@components/utils/alertHeader";

// Mock the logger if needed
jest.mock("@logger/Logger", () => ({
  debug: jest.fn(),
}));

// Mock the store so we can specify return values for alertMsg and alertType
jest.mock("@state/Store", () => ({
  useStore: jest.fn(),
}));

// We need to import our mocked store here
import { useStore } from "@state/Store";

describe("AlertHeader Component", () => {
  it("renders with the correct alert message and type", () => {
    // Tell our mock what to return when it's called for alertMsg and alertType
    (useStore as unknown as jest.Mock).mockImplementation((selector) => {
      // 'selector' is a function (the callback you give to useStore). We can check
      // its string form or a property name to figure out which piece of state is requested
      const fnString = selector.toString();
      if (fnString.includes("alertMsg")) {
        return "Test Alert Message";
      }
      if (fnString.includes("alertType")) {
        return "alert-error";
      }
      return undefined;
    });

    // Render the component
    render(<AlertHeader />);

    // Check that an element with role="alert" is rendered
    const alertElement = screen.getByRole("alert");
    expect(alertElement).toBeInTheDocument();

    // Check that it includes the custom alert type class
    expect(alertElement).toHaveClass("alert-error");

    // Check that the alert message appears
    expect(screen.getByText("Test Alert Message")).toBeInTheDocument();
  });
});
