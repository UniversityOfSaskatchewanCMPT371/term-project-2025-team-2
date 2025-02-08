import React from "react";

interface SearchInputProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

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
