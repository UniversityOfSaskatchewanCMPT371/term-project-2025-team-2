// NavButton Component
import React from "react";

interface NavButtonProps {
    onClick: () => void;
    disabled: boolean;
    label: string;
}

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
