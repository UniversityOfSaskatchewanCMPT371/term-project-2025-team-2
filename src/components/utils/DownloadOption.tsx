import React from "react";
import { Tooltip } from "react-tooltip";
import { isSafari } from "react-device-detect";

import { useStore } from "../State/Store";
import { DownloadOptionProps } from "../../types/types";

export const DownloadOption: React.FC<DownloadOptionProps> = () => {
    const safari = isSafari;
    const files = useStore((state) => state.files);
    const MAXSINGLEFILESDOWNLOAD = 15;
    const downloadOption = useStore((state) => state.downloadOption);
    const setDownloadOption = useStore((state) => state.setDownloadOption);

    const handleChange = (event: any) => {
        if (safari) {
            // Safari does not support downloading multiple files at once
            return;
        }

        if (files.length > MAXSINGLEFILESDOWNLOAD) {
            return;
        }

        if (event.target.checked) setDownloadOption("zip");
        else setDownloadOption("single");
    };

    return (
        <div>
            <label className="label mb-4 cursor-pointer">
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

