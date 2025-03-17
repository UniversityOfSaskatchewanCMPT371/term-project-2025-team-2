import { ArrowPathIcon } from "@heroicons/react/24/solid";
import logger from "@logger/Logger";
import { useStore } from "@state/Store";

/**
 * Loading screen component
 * @component
 * @precondition Loading screen component expects no props
 * @postcondition Loading screen component renders a loading screen
 * @returns Loading screen component
 */
export const LoadingScreen = () => {
    const loadingMsg = useStore((state) => state.loadingMsg);

    logger.debug("Rendering LoadingScreen component");
    return (
        <div
            role="img"
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
        >
            <div className="flex flex-col items-center">
                <ArrowPathIcon className="h-24 w-24 animate-spin text-gray-400" />
                <div className="mt-4 text-xl text-gray-400">{loadingMsg}</div>
            </div>
        </div>
    );
};
