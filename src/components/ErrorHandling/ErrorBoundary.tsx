import React from "react";
import Logger from "../utils/Logger";
import GenErrorPage from "./GenErrorPage";

/**
 * interface ErrorBoundaryProps
 * children: React.ReactNode
 * fallback: React.ReactNode
 */
interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback: React.ReactNode;
}

/**
 * ErrorBoundary
 * @param {ErrorBoundaryProps} { children, fallback }
 * @returns {JSX.Element} rendered ErrorBoundary component
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
    state = { hasError: false };

    static getDerivedStateFromError(error: any) {
        console.error("ErrorBoundary:", error);
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        Logger.error("Uncaught error:", error, errorInfo);
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <GenErrorPage
                    error={new Error("An error occurred in the application.")}
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
