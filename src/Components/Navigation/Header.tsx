import React from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { HeaderProps } from "@type/types";
import logger from "../../Logger/Logger";

/**
 * Header component for the sidebar
 * @component
 * @precondition Header component expects the following props
 * @postcondition Header component renders a header for the sidebar
 * @param {HeaderProps} props - Component props
 * @param {() => void} props.toggleModal - Function to toggle the settings modal
 * @returns {JSX.Element} Rendered Header component
 */
export const Header: React.FC<HeaderProps> = ({ toggleModal }) => {
    logger.debug("Rendering Header component");

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
