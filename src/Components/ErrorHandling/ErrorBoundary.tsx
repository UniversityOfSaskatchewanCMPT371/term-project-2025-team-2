import React, { ErrorInfo } from "react";
import logger from "../../Logger/Logger";
import GenErrorPage from "./GenErrorPage";
import { ErrorBoundaryProps } from "../../types/types";

/**
 * ErrorBoundary
 * @param {ErrorBoundaryProps} { children, fallback }
 * @returns {JSX.Element} rendered ErrorBoundary component
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
    state = { hasError: false };

    static getDerivedStateFromError(error: Error) {
        console.error("ErrorBoundary:", error);
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        logger.error("Uncaught error:", error, errorInfo);
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
