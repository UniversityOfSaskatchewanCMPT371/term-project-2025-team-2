import React from "react";

/**
 *
 * @returns rendered NavigationLinks component
 */
export const NavigationLinks: React.FC = () => {
    return (
        <ul className="space-y-4">
            <li>
                <a href="#" className="ml-3 hover:text-accent">
                    Download
                </a>
            </li>
        </ul>
    );
};
