import { GenErrorPageProps } from "../../types/types";
/**
 * GenErrorPage
 * @param {GenErrorPageProps} { error }
 * @returns {JSX.Element} rendered GenErrorPage component
 */
function GenErrorPage({ error }: GenErrorPageProps) {
    return (
        <div className="flex h-screen flex-col items-center justify-center space-y-4">
            <h1>Something went wrong.</h1>
            <p>{error.message}</p>
            <button onClick={() => window.location.reload()}>Reload</button>
        </div>
    );
}

export default GenErrorPage;
