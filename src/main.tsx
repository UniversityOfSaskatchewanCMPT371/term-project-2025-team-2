import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorHandling/ErrorBoundary.tsx";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
    <ErrorBoundary fallback={<h1>Something went wrong.</h1>}>
        <App />
    </ErrorBoundary>
);
