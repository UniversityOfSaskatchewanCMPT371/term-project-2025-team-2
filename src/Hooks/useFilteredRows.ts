import { useMemo } from "react";
import logger from "@logger/Logger";
import { DicomTag } from "@features/DicomTagTable/Types/DicomTypes";
/**
 * Custom hook for filtering DICOM table rows
 * @function
 * @precondition useFilteredRows hook expects the following parameters
 * @postcondition Returns filtered array of table rows
 * @param {TableRow[]} rows - Array of table rows to filter
 * @param {string} searchTerm - Current search term
 * @returns {TableRow[]} Filtered array of table rows
 */
export const useFilteredRows = (rows: DicomTag[], searchTerm: string) => {
    logger.debug(`Filtering rows with search term: ${searchTerm}`);
    logger.debug(`Rows length: ${rows.length}`);

    const lowerSearchTerm = searchTerm.toLowerCase();

    const filterNestedTags = (value: any): any => {
        if (!value) return [];

        // SQ sequences — array of items
        if (Array.isArray(value)) {
            logger.debug("Filtering nested array of sequence items");

            const filteredItems = value
                .map((item: any) => {
                    if (!item?.tags) return null;

                    const filteredTags = Object.values(item.tags).filter(
                        (nestedRow: any) => {
                            const tagId = (nestedRow.tagId ?? "")
                                .toString()
                                .toLowerCase();
                            const tagName = (nestedRow.tagName ?? "")
                                .toString()
                                .toLowerCase();
                            const val = (nestedRow.value ?? "")
                                .toString()
                                .toLowerCase();

                            return (
                                tagId.includes(lowerSearchTerm) ||
                                tagName.includes(lowerSearchTerm) ||
                                val.includes(lowerSearchTerm) ||
                                matchesNestedTags(nestedRow.value)
                            );
                        }
                    );

                    if (filteredTags.length > 0) {
                        return {
                            tags: Object.fromEntries(
                                (
                                    filteredTags as Array<{
                                        tagId: string;
                                        tagName?: string;
                                        value?: any;
                                    }>
                                ).map((tag) => [tag.tagId, tag])
                            ),
                        };
                    }
                    return null;
                })
                .filter((item: any) => item !== null);

            return filteredItems;
        }

        // single nested object
        if (typeof value === "object" && value.tags) {
            logger.debug("Filtering single nested object with tags");

            const filteredTags = Object.values(value.tags).filter(
                (nestedRow: any) => {
                    const tagId = (nestedRow.tagId ?? "")
                        .toString()
                        .toLowerCase();
                    const tagName = (nestedRow.tagName ?? "")
                        .toString()
                        .toLowerCase();
                    const val = (nestedRow.value ?? "")
                        .toString()
                        .toLowerCase();

                    return (
                        tagId.includes(lowerSearchTerm) ||
                        tagName.includes(lowerSearchTerm) ||
                        val.includes(lowerSearchTerm) ||
                        matchesNestedTags(nestedRow.value)
                    );
                }
            );

            if (filteredTags.length > 0) {
                return {
                    tags: Object.fromEntries(
                        filteredTags.map((tag: any) => [tag.tagId, tag])
                    ),
                };
            }
        }

        return null;
    };

    const matchesNestedTags = (value: any): boolean => {
        if (!value) return false;

        if (Array.isArray(value)) {
            return value.some((item) => {
                if (item?.tags) {
                    return Object.values(item.tags).some((nestedRow: any) => {
                        const tagId = (nestedRow.tagId ?? "")
                            .toString()
                            .toLowerCase();
                        const tagName = (nestedRow.tagName ?? "")
                            .toString()
                            .toLowerCase();
                        const val = (nestedRow.value ?? "")
                            .toString()
                            .toLowerCase();

                        return (
                            tagId.includes(lowerSearchTerm) ||
                            tagName.includes(lowerSearchTerm) ||
                            val.includes(lowerSearchTerm) ||
                            matchesNestedTags(nestedRow.value)
                        );
                    });
                }
                return false;
            });
        }

        if (typeof value === "object" && value.tags) {
            return Object.values(value.tags).some((nestedRow: any) => {
                const tagId = (nestedRow.tagId ?? "").toString().toLowerCase();
                const tagName = (nestedRow.tagName ?? "")
                    .toString()
                    .toLowerCase();
                const val = (nestedRow.value ?? "").toString().toLowerCase();

                return (
                    tagId.includes(lowerSearchTerm) ||
                    tagName.includes(lowerSearchTerm) ||
                    val.includes(lowerSearchTerm) ||
                    matchesNestedTags(nestedRow.value)
                );
            });
        }

        return false;
    };

    return useMemo(
        () =>
            rows
                .map((row) => {
                    const tagId = (row.tagId ?? "").toLowerCase();
                    const tagName = (row.tagName ?? "").toLowerCase();
                    const valueStr = (row.value ?? "").toString().toLowerCase();

                    const matchesDirect =
                        tagId.includes(lowerSearchTerm) ||
                        tagName.includes(lowerSearchTerm) ||
                        valueStr.includes(lowerSearchTerm);

                    const nestedMatches = matchesNestedTags(row.value);
                    const filteredNestedValue = nestedMatches
                        ? filterNestedTags(row.value)
                        : null;

                    if (matchesDirect) {
                        return row;
                    } else if (nestedMatches && filteredNestedValue) {
                        return { ...row, value: filteredNestedValue };
                    }

                    return null;
                })
                .filter(Boolean),
        [rows, lowerSearchTerm]
    );
};
