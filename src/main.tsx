import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { ErrorBoundary } from "./Components/ErrorHandling/ErrorBoundary.tsx";
import { registerSW } from "virtual:pwa-register";
import logger from "./Logger/Logger.ts";
import "react-tooltip/dist/react-tooltip.css";

// Register service worker with auto-update
const updateSW = registerSW({
    immediate: false,
    onNeedRefresh() {
        // Only show update prompt in production
        if (!import.meta.env.DEV) {
            if (confirm("New content available. Reload?")) {
                updateSW(true);
            }
        }
    },
    onOfflineReady() {
        logger.debug("App ready to work offline");
    },
    onRegistered() {
        logger.debug("Service Worker has been registered");
    },
    onRegisterError(error: any) {
        logger.debug("Service Worker registration failed:", error);
    },
});

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
    <ErrorBoundary fallback={<h1>Something went wrong.</h1>}>
        <App />
    </ErrorBoundary>
);
