import { ArrowPathIcon } from "@heroicons/react/24/solid";

/**
 *
 * @returns Loading screen component
 */
const LoadingScreen = () => {
    return (
        <div
            role="dialog"
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
        >
            <div className="flex h-full items-center justify-center">
                <ArrowPathIcon className="h-24 w-24 animate-spin text-gray-400" />
            </div>
        </div>
    );
};

export { LoadingScreen };
