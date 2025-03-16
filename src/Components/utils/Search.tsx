import React from "react";
import { SearchProps } from "@type/types";
import logger from "@logger/Logger";

/**
 * Search component for filtering tags
 * @component
 * @precondition Search component expects the following props
 * @postcondition Search component renders a search input
 * @param searchTerm - Current search term
 * @param onSearchChange - Function to handle search term change
 * @returns rendered Search component
 */
export const Search: React.FC<SearchProps> = ({
    searchTerm,
    onSearchChange,
}) => {
    logger.debug("Rendering Search component");

    return (
        <div className="mb-4 flex items-center">
            <input
                type="text"
                data-testid="dicom-search-input"
                className="rounded border px-4 py-2"
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
            />
        </div>
    );
};
