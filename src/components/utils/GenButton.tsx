import React from "react";
import { GenButtonProps } from "../../types/types";

/**
 *
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
            className="rounded bg-secondary px-4 py-2 text-base-content hover:bg-accent disabled:bg-base-300"
        >
            {label}
        </button>
    );
};
