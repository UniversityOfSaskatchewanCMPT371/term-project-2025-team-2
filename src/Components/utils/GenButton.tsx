import React from "react";
import { GenButtonProps } from "@type/types";

/**
 * General button component
 * @component
 * @precondition GenButton component expects the following props
 * @postcondition GenButton component renders a button
 * @param onClick - Function to handle button click
 * @param disabled - Boolean to determine if button is disabled
 * @param label - Button label
 * @returns rendered NavButton component
 */
export const GenButton: React.FC<GenButtonProps> = ({
    onClick,
    disabled,
    label,
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-content shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:bg-base-300 disabled:hover:scale-100"
        >
            {label}
        </button>
    );
};
