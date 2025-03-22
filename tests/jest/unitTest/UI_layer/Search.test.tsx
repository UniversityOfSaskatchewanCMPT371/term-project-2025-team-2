import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Search } from "@components/utils/Search";
import "@testing-library/jest-dom";

describe("Search component", () => {
    test("renders search input with the correct placeholder and value", () => {
        const onSearchChangeMock = jest.fn();

        render(<Search searchTerm="" onSearchChange={onSearchChangeMock} />);

        const inputElement = screen.getByPlaceholderText("Search tags...");

        expect(inputElement).toBeInTheDocument();
        expect(inputElement).toHaveValue("");
    });

    test("calls onSearchChange when the input value changes", () => {
        const onSearchChangeMock = jest.fn();

        const TestComponent = () => {
            const [searchTerm, setSearchTerm] = useState("");
            const handleSearchChange = (newSearchTerm: string) => {
                setSearchTerm(newSearchTerm);
                onSearchChangeMock(newSearchTerm);
            };

            return (
                <Search
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                />
            );
        };

        render(<TestComponent />);

        const inputElement = screen.getByPlaceholderText("Search tags...");

        fireEvent.change(inputElement, { target: { value: "test search" } });

        expect(onSearchChangeMock).toHaveBeenCalledTimes(1);
        expect(onSearchChangeMock).toHaveBeenCalledWith("test search");

        expect(inputElement).toHaveValue("test search");
    });

    test("does not call onSearchChange when the input value is the same", () => {
        const onSearchChangeMock = jest.fn();

        const TestComponent = () => {
            const [searchTerm, setSearchTerm] = useState("initial value");
            const handleSearchChange = (newSearchTerm: string) => {
                setSearchTerm(newSearchTerm);
                onSearchChangeMock(newSearchTerm);
            };

            return (
                <Search
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                />
            );
        };

        render(<TestComponent />);

        const inputElement = screen.getByPlaceholderText("Search tags...");

        fireEvent.change(inputElement, { target: { value: "initial value" } });

        expect(onSearchChangeMock).not.toHaveBeenCalled();
        expect(inputElement).toHaveValue("initial value");
    });
    test("calls onSearchChange when searching for nested tag terms", () => {
        const onSearchChangeMock = jest.fn();

        const TestComponent = () => {
            const [searchTerm, setSearchTerm] = useState("");
            const handleSearchChange = (newSearchTerm: string) => {
                setSearchTerm(newSearchTerm);
                onSearchChangeMock(newSearchTerm);
            };

            return (
                <Search
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                />
            );
        };

        render(<TestComponent />);

        const inputElement = screen.getByPlaceholderText("Search tags...");

        fireEvent.change(inputElement, { target: { value: "Clean Pixel" } });

        expect(onSearchChangeMock).toHaveBeenCalledWith("Clean Pixel");
    });
});
