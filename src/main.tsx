import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorHandling/ErrorBoundary.tsx";
import { registerSW } from 'virtual:pwa-register';

// Register service worker with auto-update
const updateSW = registerSW({
    immediate: false,
    onNeedRefresh() {
        // Only show update prompt in production
        if (!import.meta.env.DEV) {
            if (confirm('New content available. Reload?')) {
                updateSW(true);
            }
        }
    },
    onOfflineReady() {
        console.log('App ready to work offline');
    },
    onRegistered(_r: ServiceWorkerRegistration | undefined) {
        console.log('Service Worker has been registered');
    },
    onRegisterError(error: any) {
        console.error('Service Worker registration failed:', error);
    }
});

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
    <ErrorBoundary fallback={<h1>Something went wrong.</h1>}>
        <App />
    </ErrorBoundary>
);
