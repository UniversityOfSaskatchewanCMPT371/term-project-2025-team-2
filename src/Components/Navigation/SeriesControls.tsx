import React from "react";
import { Tooltip } from "react-tooltip";
import { GenButton } from "../utils/GenButton";
import { SeriesControlsProps } from "../../types/types";

import { updateAllFiles } from "../../DataFunctions/DicomData/UpdateAllFiles";
import { useStore } from "@state/Store";

/**
 * SeriesControls component for managing series-related functionality
 * @component
 * @precondition SeriesControls component expects the following props
 * @postcondition SeriesControls component renders a series controls component
 * @returns {JSX.Element} Rendered SeriesControls component
 */
export const SeriesControls: React.FC<SeriesControlsProps> = () => {
    const files = useStore((state) => state.files);
    const dicomData = useStore((state) => state.dicomData);
    const currentFileIndex = useStore((state) => state.currentFileIndex);
    const newTagValues = useStore((state) => state.newTagValues);
    const downloadOption = useStore((state) => state.downloadOption);
    const series = useStore((state) => state.series);
    const seriesToggle = useStore((state) => state.toggleSeries);
    const clearData = useStore((state) => state.clearData);

    return (
        <>
            <GenButton
                label={series ? "Apply Edits to All Files" : "Save All Files"}
                disabled={false}
                onClick={() => {
                    updateAllFiles(
                        dicomData,
                        series,
                        newTagValues,
                        files,
                        currentFileIndex,
                        downloadOption
                    );
                    clearData();
                }}
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
