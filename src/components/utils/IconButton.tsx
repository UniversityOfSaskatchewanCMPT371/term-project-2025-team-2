import React from "react";
import { IconButtonProps } from "../../types/types";

/**
 * Help icon
 * @returns rendered help icon
 */
const helpIcon = () => {
    return <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-8"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
        />
    </svg>
}

/**
 * HelpIcon component
 * @param onClick - Function to handle help icon click
 * @returns rendered HelpIcon component
 */
const IconButton: React.FC<IconButtonProps> = ({ onClick, icon }) => {
    return (
        <div className="cursor-pointer hover:text-accent" onClick={onClick}>
            {icon !=="help" ? icon : helpIcon()}
        </div>
    );
};

export default IconButton;
