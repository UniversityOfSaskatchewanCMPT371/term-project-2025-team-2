import React from "react";

interface NestedTagRowProps {
    nestedRow: { tagId: string; tagName: string; value: string };
    index: number;
}

const handleClick = () => {
    console.log("Edit clicked!");
};

export const NestedTagRow: React.FC<NestedTagRowProps> = ({
    nestedRow,
    index,
}) => {
    return (
        <tr key={nestedRow.tagId + index}>
            <td className="break-all border bg-secondary px-4 py-2">
                {nestedRow.tagId}
            </td>
            <td className="break-all border px-4 py-2">{nestedRow.tagName}</td>
            <td className="break-all border px-4 py-2">
                <div className="flex">
                    <div className="flex-1 break-all">{nestedRow.value}</div>
                    <div
                        className="flex cursor-pointer justify-end hover:text-accent"
                        onClick={handleClick}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                        </svg>
                    </div>
                </div>
            </td>
        </tr>
    );
};
