
/**
 * interface GenErrorPageProps 
 * error: Error
 */
interface GenErrorPageProps {
    error: Error;
}

/**
 * GenErrorPage
 * @param {GenErrorPageProps} { error }
 * @returns {JSX.Element} rendered GenErrorPage component
 */
function GenErrorPage({ error }: GenErrorPageProps) {
    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <h1>Something went wrong.</h1>
            <p>{error.message}</p>
            <button onClick={() => window.location.reload()}>Reload</button>
        </div>
    );
}

export default GenErrorPage;