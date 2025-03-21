import React from "react";
import { useStore } from "@state/Store";
import logger from "@logger/Logger";

/**
 * Alert Header
 * @component
 * @description Alert header
 * @precondition AlertHeader component expects no props
 * @postcondition AlertHeader component renders an alert header
 * @returns {JSX.Element} The rendered alert header
 */
export const AlertHeader: React.FC = () => {
    const alertMsg = useStore((state) => state.alertMsg);
    const alertType = useStore((state) => state.alertType);

    logger.debug("Rendering AlertHeader");
    logger.debug(`Alert message: ${alertMsg}`);
    logger.debug(`Alert type: ${alertType}`);

    return (
        <div className="fixed left-0 top-0 z-50 flex w-full items-center justify-center bg-black bg-opacity-50">
            <div role="alert" className={`alert ${alertType}`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span>{alertMsg}</span>
            </div>
        </div>
    );
};
