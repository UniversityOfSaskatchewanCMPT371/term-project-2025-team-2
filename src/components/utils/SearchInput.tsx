import React from "react";

/**
 * interface SearchInputProps
 * @param searchTerm - Search term
 * @param onSearchChange - Function to handle search term change
 */
interface SearchInputProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

/**
 *
 * @param searchTerm - Search term
 * @param onSearchChange - Function to handle search term change
 * @returns rendered SearchInput component
 */
export const SearchInput: React.FC<SearchInputProps> = ({
    searchTerm,
    onSearchChange,
}) => {
    return (
        <input
            type="text"
            placeholder="Search tags..."
            className="mt-4 rounded border border-secondary p-2"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
        />
    );
};
