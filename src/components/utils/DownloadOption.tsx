import React from "react";

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
            <label htmlFor="download-option">
                <input
                    type="checkbox"
                    id="download-option"
                    checked={downloadOption === "zip"}
                    onChange={handleChange}
                />
                {downloadOption === "zip" ? " Zip" : " Single"}
            </label>
        </div>
    );
};

export default DownloadOption;
