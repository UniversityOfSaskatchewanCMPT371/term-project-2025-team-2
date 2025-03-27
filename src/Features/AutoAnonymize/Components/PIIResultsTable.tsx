import React, { useState } from "react";
import { DicomTableRow } from "@features/DicomTagTable/Components/DicomTableRow";
import { DicomTag } from "../../DicomTagTable/Types/DicomTypes";

/**
 * Props for the PIIResultsTable component
 */
interface PIIResultsTableProps {
    PII: DicomTag[];
    reset: number;
    onUpdateValue: (tagId: string, newValue: string, deleteTag: boolean) => void;
}

/**
 * Component to display potentially found PII in DICOM files with pagination
 * @component
 * @precondition PII data must be loaded and passed as props
 * @postcondition Renders a table showing potential PII found in files with pagination controls
 * @param props - The PIIResultsTableProps properties
 * @returns {JSX.Element | null} The rendered PII table or null if no PII is found
 */
export const PIIResultsTable: React.FC<PIIResultsTableProps> = ({ 
    PII, 
    reset, 
    onUpdateValue 
}) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 4;
    const totalPages = Math.ceil(PII.length / itemsPerPage);
    
    if (PII.length === 0) {
        return null;
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = PII.slice(startIndex, endIndex);
    
    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };
    
    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    return (
        <div>
            <div className="mb-5 ml-4 text-xl font-bold text-error">
                Potential PII Found in File
            </div>
            
            {PII.length > itemsPerPage && (
                <div className="mx-4 mb-2 flex items-center justify-between">
                    <button 
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="rounded-md bg-base-300 px-3 py-1 text-sm font-medium transition-colors hover:bg-base-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Previous
                    </button>
                    
                    <span className="text-sm">
                        Page {currentPage} of {totalPages} ({PII.length} items)
                    </span>
                    
                    <button 
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="rounded-md bg-base-300 px-3 py-1 text-sm font-medium transition-colors hover:bg-base-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
            
            <table className="m-4 mb-10 border bg-base-100 text-lg text-base-content">
                <thead>
                    <tr className="text-wrap bg-error">
                        <th className="w-1/5 border px-4 py-2 text-primary-content">
                            Tag ID
                        </th>
                        <th className="w-1/4 border px-4 py-2 text-primary-content">
                            Tag Name
                        </th>
                        <th className="w-7/12 border px-4 py-2 text-primary-content">
                            Value
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((tag, index) => (
                        <DicomTableRow
                            key={startIndex + index + tag.tagId + reset}
                            row={{
                                tagId: tag.tagId,
                                tagName: tag.tagName,
                                value: tag.value as string,
                            }}
                            index={startIndex + index}
                            onUpdateValue={onUpdateValue}
                            updated={false}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};