import React from "react";
import logger from "../../Logger/Logger";

/**
 * Footer component
 * @component
 * @precondition - Footer component expects no props
 * @postcondition - Footer component renders a footer with information
 * @returns rendered Footer component
 * @description Footer component to display footer information
 */
export const Footer: React.FC = () => {
    logger.debug("Rendering Footer component");

    return (
        <footer className="z-10 mt-4 bg-primary p-4 text-center text-white">
            <a href="https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2025-team-2">
                &copy; 2025 University of Saskatchewan - CMPT 371 Team 2 - All
                rights reserved.
            </a>
        </footer>
    );
};
