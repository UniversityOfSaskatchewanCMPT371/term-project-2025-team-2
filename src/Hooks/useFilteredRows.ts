import { useMemo } from "react";
import logger from "@logger/Logger";

/**
 * Custom hook for filtering DICOM table rows
 * @function
 * @precondition useFilteredRows hook expects the following parameters
 * @postcondition Returns filtered array of table rows
 * @param {TableRow[]} rows - Array of table rows to filter
 * @param {string} searchTerm - Current search term
 * @returns {TableRow[]} Filtered array of table rows
 */
export const useFilteredRows = (rows: any[], searchTerm: string) => {
    logger.debug(`Filtering rows with search term: ${searchTerm}`);
    logger.debug(`Rows length: ${rows.length}`);

    const lowerSearchTerm = searchTerm.toLowerCase();

    return useMemo(
        () =>
            rows.filter((row) => {
                const tagId = (row.tagId ?? "").toString().toLowerCase();
                const tagName = (row.tagName ?? "").toString().toLowerCase();

                const matchesTag =
                    tagId.includes(lowerSearchTerm) ||
                    tagName.includes(lowerSearchTerm);

                const matchesNested =
                    Array.isArray(row.value) &&
                    row.value.some((nestedRow: any) => {
                        const nestedTagId = (nestedRow?.tagId ?? "")
                            .toString()
                            .toLowerCase();
                        const nestedTagName = (nestedRow?.tagName ?? "")
                            .toString()
                            .toLowerCase();
                        return (
                            nestedTagId.includes(lowerSearchTerm) ||
                            nestedTagName.includes(lowerSearchTerm)
                        );
                    });

                const matchesValue =
                    !Array.isArray(row.value) &&
                    (row.value ?? "")
                        .toString()
                        .toLowerCase()
                        .includes(lowerSearchTerm);

                return matchesTag || matchesNested || matchesValue;
            }),
        [rows, lowerSearchTerm]
    );
};
