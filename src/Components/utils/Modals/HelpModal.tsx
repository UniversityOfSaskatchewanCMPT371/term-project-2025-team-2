import React from "react";
import { GenButton } from "../GenButton";
import { HelpModalProps } from "@type/types";
import { useStore } from "@state/Store";
import logger from "@logger/Logger";

/**
 * HelpModal component for displaying help documentation
 * @component
 * @precondition HelpModal component expects no props
 * @postcondition HelpModal component renders a modal with help information
 * @returns {JSX.Element} Rendered HelpModal component
 * @description Displays help information and documentation about the DICOM tag editor
 */
export const HelpModal: React.FC<HelpModalProps> = () => {
    const setShowDictEdit = useStore((state) => state.setShowDictEdit);
    const setAutoAnonTagsEditPanelVisible = useStore(
        (state) => state.setAutoAnonTagsEditPanelVisible
    );

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
                <div className="flex-col-2 flex justify-between">
                    <div className="mt-6">
                        <GenButton
                            onClick={() => {
                                logger.debug(
                                    "Edit Tag Dictionary button clicked"
                                );
                                const helpModal =
                                    document.getElementById("help_modal");
                                if (helpModal) {
                                    (helpModal as HTMLDialogElement).close();
                                }
                                setShowDictEdit(true);
                            }}
                            disabled={false}
                            label="Edit Tag Dictionary"
                        />
                    </div>
                    <div className="mt-6">
                        <GenButton
                            onClick={() => {
                                logger.debug(
                                    "Edit Auto-Anon Tags button clicked"
                                );
                                const helpModal =
                                    document.getElementById("help_modal");
                                if (helpModal) {
                                    (helpModal as HTMLDialogElement).close();
                                }
                                setAutoAnonTagsEditPanelVisible(true);
                            }}
                            disabled={false}
                            label="Edit Auto-Anon Tags"
                        />
                    </div>
                    <div className="modal-action">
                        <form method="dialog">
                            <GenButton
                                onClick={() => {
                                    logger.debug(
                                        "Close Help modal button clicked"
                                    );
                                    const helpModal =
                                        document.getElementById("help_modal");
                                    if (helpModal) {
                                        (
                                            helpModal as HTMLDialogElement
                                        ).close();
                                    }
                                }}
                                disabled={false}
                                label="Close"
                            />
                        </form>
                    </div>
                </div>
            </div>
        </dialog>
    );
};
