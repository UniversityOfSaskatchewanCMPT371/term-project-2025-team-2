import React from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { GenButton } from "../utils/GenButton";
import DownloadOption from "../utils/DownloadOption";
import { SettingsModalProps } from "../../types/types";

/**
 * SettingsModal component for managing application settings
 * @component
 * @param {SettingsModalProps} props - Component props
 * @param {() => void} props.toggleModal - Function to toggle the modal visibility
 * @param {File[]} props.files - Array of file objects
 * @param {(option: string) => void} props.setDownloadOption - Function to set the download option
 * @param {string} props.downloadOption - Currently selected download option
 * @returns {JSX.Element} Rendered SettingsModal component
 */
const SettingsModal: React.FC<SettingsModalProps> = ({
    toggleModal,
    files,
    setDownloadOption,
    downloadOption,
}) => {
    return (
        <div
            role="dialog"
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={toggleModal}
        >
            <div
                className="w-full max-w-sm rounded bg-base-100 p-6 text-base-content shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <h4 className="mb-4 text-xl font-semibold">Settings</h4>
                    <QuestionMarkCircleIcon
                        className="mb-4 size-6 cursor-pointer text-base-content/70 transition-colors hover:scale-110 hover:text-accent"
                        onClick={() => {
                            const helpModal =
                                document.getElementById("help_modal");
                            if (helpModal) {
                                (helpModal as HTMLDialogElement).showModal();
                            }
                        }}
                    />
                </div>

                {files.length > 1 ? (
                    <>
                        <p>Download Option</p>
                        <DownloadOption
                            setDownloadOption={setDownloadOption}
                            downloadOption={downloadOption}
                        />
                    </>
                ) : (
                    <div className="mb-4">No Options</div>
                )}

                <GenButton
                    onClick={toggleModal}
                    disabled={false}
                    label="Close"
                />
            </div>
        </div>
    );
};

export default SettingsModal;
