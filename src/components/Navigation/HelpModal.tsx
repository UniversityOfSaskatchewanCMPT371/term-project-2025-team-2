import React from "react";
import { GenButton } from "../utils/GenButton";
import { HelpModalProps } from "../../types/types";

/**
 * HelpModal component for displaying help documentation
 * @component
 * @returns {JSX.Element} Rendered HelpModal component
 * @description Displays help information and documentation about the DICOM tag editor
 */
const HelpModal: React.FC<HelpModalProps> = () => {
    return (
        <dialog id="help_modal" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="text-2xl font-bold">Help</h3>
                <div className="py-4 text-lg font-semibold">
                    Dicom tag Editor Options
                </div>
                <ul>
                    <li>Edit tag values or remove tags</li>
                    <li>
                        Toggle between editing files individually or as a series
                    </li>
                    <li>Download files as a zip or individual files</li>
                </ul>
                <div className="mt-4">
                    <a
                        href="https://github.com/UniversityOfSaskatchewanCMPT371/term-project-2025-team-2"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-info"
                    >
                        Detailed User Guide
                    </a>
                </div>
                <div className="modal-action">
                    <form method="dialog">
                        <GenButton
                            onClick={() => {
                                const helpModal =
                                    document.getElementById("help_modal");
                                if (helpModal) {
                                    (helpModal as HTMLDialogElement).close();
                                }
                            }}
                            disabled={false}
                            label="Close"
                        />
                    </form>
                </div>
            </div>
        </dialog>
    );
};

export default HelpModal;
