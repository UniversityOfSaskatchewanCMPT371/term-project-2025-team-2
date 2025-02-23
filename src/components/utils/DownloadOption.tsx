import React from "react";
import { Tooltip } from "react-tooltip";

interface DownloadOptionProps {
    setDownloadOption: (value: string) => void;
    downloadOption: string;
}

const DownloadOption: React.FC<DownloadOptionProps> = ({
    setDownloadOption,
    downloadOption,
}) => {
    const handleChange = (event: any) => {
        if (event.target.checked) setDownloadOption("zip");
        else setDownloadOption("single");
    };

    return (
        <div>
            <label className="label cursor-pointer mb-4">
                <input
                    className="toggle toggle-info"
                    type="checkbox"
                    id="download-option"
                    checked={downloadOption === "zip"}
                    onChange={handleChange}
                    data-tooltip-id="download-option-button-tooltip"
                    data-tooltip-content={downloadOption === "zip" ? "Switch to Individual Files" : "Switch to Zip File"}
                    data-tooltip-place="top"
                />
                {downloadOption === "zip" ? <span>Zip File</span> : <span>Individual Files</span>}
            </label>
            <Tooltip id="download-option-button-tooltip" />
        </div>
    );
};

export default DownloadOption;
