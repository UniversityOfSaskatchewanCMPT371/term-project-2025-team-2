import React from "react";
import { Tooltip } from "react-tooltip";
import { GenButton } from "../utils/GenButton";
import { SeriesControlsProps } from "../../types/types";

/**
 * SeriesControls component for managing series-related functionality
 * @component
 * @param {SeriesControlsProps} props - Component props
 * @param {boolean} props.series - Flag indicating if series mode is active
 * @param {() => void} props.updateAllFiles - Function to update all files
 * @param {() => void} props.seriesToggle - Function to toggle series mode
 * @returns {JSX.Element} Rendered SeriesControls component
 */
const SeriesControls: React.FC<SeriesControlsProps> = ({
    series,
    updateAllFiles,
    seriesToggle,
}) => {
    return (
        <>
            <GenButton
                label={series ? "Apply Edits to All Files" : "Save All Files"}
                disabled={false}
                onClick={updateAllFiles}
            />
            <div className="mt-4 rounded-lg bg-base-300/50 p-3 backdrop-blur-sm">
                <button
                    onClick={seriesToggle}
                    className="w-full rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary"
                    data-tooltip-id="series-button-tooltip"
                    data-tooltip-content={
                        series
                            ? "Click to edit individually"
                            : "Click to edit as series"
                    }
                    data-tooltip-place="top"
                >
                    {series
                        ? "✨ Editing as Series"
                        : "🔄 Editing Individually"}
                </button>
                <Tooltip id="series-button-tooltip" />
            </div>
        </>
    );
};

export default SeriesControls;
