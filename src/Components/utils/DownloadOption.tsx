import React from "react";
import { Tooltip } from "react-tooltip";
import { isSafari } from "react-device-detect";

import { useStore } from "@state/Store";
import { DownloadOptionProps } from "@type/types";
import { assert } from "@dataFunctions/assert";

/**
 * Download option component
 * @component
 * @precondition DownloadOption component expects the following props
 * @postcondition DownloadOption component renders a toggle to switch between downloading individual files and a zip file
 * @param {DownloadOptionProps} props - Component props
 * @returns {JSX.Element} Rendered DownloadOption component
 */
export const DownloadOption: React.FC<DownloadOptionProps> = () => {
    const safari = isSafari;
    const files = useStore((state) => state.files);
    const MAXSINGLEFILESDOWNLOAD = 15;
    const downloadOption = useStore((state) => state.downloadOption);
    const setDownloadOption = useStore((state) => state.setDownloadOption);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (safari) {
            // Safari does not support downloading multiple files at once
            return;
        }

        if (files.length > MAXSINGLEFILESDOWNLOAD) {
            return;
        }

        if (event.target.checked) {
            setDownloadOption("zip");
        } else {
            setDownloadOption("single");
        }

        assert(downloadOption === "zip" || downloadOption === "single");
    };

    return (
        <div>
            <label className="label mb-2 cursor-pointer">
                <input
                    className="toggle toggle-info"
                    type="checkbox"
                    id="download-option"
                    checked={downloadOption === "zip"}
                    onChange={handleChange}
                    data-tooltip-id="download-option-button-tooltip"
                    data-tooltip-content={
                        files.length > MAXSINGLEFILESDOWNLOAD
                            ? "Too many files - Zip Only"
                            : safari
                              ? "Not supported in Safari"
                              : downloadOption === "zip"
                                ? "Switch to Individual Files"
                                : "Switch to Zip File"
                    }
                    data-tooltip-place="top"
                />
                {downloadOption === "zip" ? (
                    <span>Zip File</span>
                ) : (
                    <span>Individual Files</span>
                )}
            </label>
            <Tooltip id="download-option-button-tooltip" />
        </div>
    );
};
