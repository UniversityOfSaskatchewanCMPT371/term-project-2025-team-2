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
export const GenButton: React.FC<NavButtonProps> = ({
    onClick,
    disabled,
    label,
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="rounded-lg bg-primary text-white px-4 py-2 transition duration-300 ease-in-out transform hover:bg-secondary hover:scale-105 disabled:bg-gray-400"
        >
            {label}
        </button>
    );
};
