import React from "react";

export const NavigationLinks: React.FC = () => {
    return (
        <ul className="space-y-4">
            <li>
                <a href="#" className="hover:text-blue-400">
                    Home
                </a>
            </li>
            <li>
                <a href="#" className="hover:text-blue-400">
                    About
                </a>
            </li>
        </ul>
    );
};
