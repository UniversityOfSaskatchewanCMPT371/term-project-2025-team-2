import { GenErrorPageProps } from "../../types/types";
import { GenButton } from "../utils/GenButton";
/**
 * GenErrorPage
 * @param error - Error object
 * @returns rendered GenErrorPage component
 */
function GenErrorPage({ error }: GenErrorPageProps) {
    return (
        <div className="flex h-screen flex-col items-center justify-center space-y-4">
            <h1>Something went wrong.</h1>
            <p>{error.message}</p>
            <GenButton
                label="Reload"
                onClick={() => window.location.reload()}
                disabled={false}
            />
        </div>
    );
}

export default GenErrorPage;
