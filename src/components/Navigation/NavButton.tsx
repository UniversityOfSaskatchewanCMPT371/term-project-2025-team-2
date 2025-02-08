import React from "react";

/**
 * interface NavButtonProps
 * @param onClick - Function to handle button click
 * @param disabled - Boolean to determine if button is disabled
 * @param label - Button label
 */
interface NavButtonProps {
    onClick: () => void;
    disabled: boolean;
    label: string;
}

/**
 *
 * @param onClick - Function to handle button click
 * @param disabled - Boolean to determine if button is disabled
 * @param label - Button label
 * @returns rendered NavButton component
 */
export const NavButton: React.FC<NavButtonProps> = ({
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
