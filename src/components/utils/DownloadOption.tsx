import React from "react";
import { Tooltip } from "react-tooltip";
import { isSafari } from "react-device-detect";

interface DownloadOptionProps {
    setDownloadOption: (value: string) => void;
    downloadOption: string;
}

const DownloadOption: React.FC<DownloadOptionProps> = ({
    setDownloadOption,
    downloadOption,
}) => {
    const safari = isSafari;

    const handleChange = (event: any) => {
        if (safari) {
            // Safari does not support downloading multiple files at once
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
                        safari ? "Not supported in Safari" :
                        downloadOption === "zip"
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

export default DownloadOption;
