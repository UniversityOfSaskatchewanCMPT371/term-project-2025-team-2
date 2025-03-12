import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import { GenButton } from "../utils/GenButton";
import { SeriesControlsProps } from "../../types/types";

import { updateAllFiles } from "../DicomData/UpdateAllFiles";
import { useStore } from "../State/Store";
import NoEditsModal from "../utils/Modals/NoEditsModal";

/**
 * SeriesControls component for managing series-related functionality
 * @component
 * @param {SeriesControlsProps} props - Component props
 * @returns {JSX.Element} Rendered SeriesControls component
 */
export const SeriesControls: React.FC<SeriesControlsProps> = () => {
    const [showNoEditsModal, setShowNoEditsModal] = useState(false);

    const files = useStore((state) => state.files);
    const dicomData = useStore((state) => state.dicomData);
    const currentFileIndex = useStore((state) => state.currentFileIndex);
    const newTagValues = useStore((state) => state.newTagValues);
    const downloadOption = useStore((state) => state.downloadOption);
    const series = useStore((state) => state.series);
    const seriesToggle = useStore((state) => state.toggleSeries);
    const clearData = useStore((state) => state.clearData);

    const handleSaveAll = async () => {
        const hasEdits = await updateAllFiles(
            dicomData,
            series,
            newTagValues,
            files,
            currentFileIndex,
            downloadOption,
            setShowNoEditsModal
        );

        if (hasEdits) {
            clearData();
        }
    };

    return (
        <>
            <GenButton
                label={series ? "Apply Edits to All Files" : "Save All Files"}
                disabled={false}
                onClick={handleSaveAll}
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
                    {series ? "✨ Editing as Series" : "🔄 Editing Individually"}
                </button>
                <Tooltip id="series-button-tooltip" />
            </div>

            <NoEditsModal
                isOpen={showNoEditsModal}
                onClose={() => setShowNoEditsModal(false)}
            />
        </>
    );
};
