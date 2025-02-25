import React from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { HeaderProps } from "../../types/types";

/**
 * Header component for the sidebar
 * @component
 * @param {HeaderProps} props - Component props
 * @param {() => void} props.toggleModal - Function to toggle the settings modal
 * @returns {JSX.Element} Rendered Header component
 */
const Header: React.FC<HeaderProps> = ({ toggleModal }) => {
    return (
        <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold text-primary">Files</h3>
            <Cog6ToothIcon
                className="size-6 cursor-pointer text-base-content/70 transition-colors hover:scale-110 hover:text-accent"
                onClick={toggleModal}
            />
        </div>
    );
};

export default Header;
