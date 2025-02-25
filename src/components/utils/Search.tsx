import React from "react";
import { SearchProps } from "../../types/types";

/**
 *
 * @param searchTerm - Current search term
 * @param onSearchChange - Function to handle search term change
 * @returns rendered Search component
 */
const Search: React.FC<SearchProps> = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="mb-4 flex items-center">
            <input
                type="text"
                className="rounded border px-4 py-2"
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
            />
        </div>
    );
};

export default Search;
