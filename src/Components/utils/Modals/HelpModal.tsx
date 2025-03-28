import React from "react";
import { GenButton } from "../GenButton";
import { HelpModalProps } from "@type/types";
import { useStore } from "@state/Store";
import logger from "@logger/Logger";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { TagDictionaryDB } from "@services/TagDictionaryDB";
import { useQuestionModalStore } from "@state/QuestionModalStore";

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
    const setAlertMsg = useStore((state) => state.setAlertMsg);
    const setAlertType = useStore((state) => state.setAlertType);
    const setShowAlert = useStore((state) => state.setShowAlert);

    const openModal = useQuestionModalStore((state) => state.openModal);

    /**
     * Confirm clearing all local application data
     */
    const confirmClearData = () => {
        openModal({
            title: "Clear Data",
            text: "Are you sure you want to clear all local application data? This action cannot be undone.",
            onConfirm: () => {
                logger.info("User confirmed to clear data");
                handleClearData();
            },
            onCancel: () => {
                logger.info("User cancelled clearing data");
                const helpModal = document.getElementById("help_modal");
                if (helpModal) {
                    (helpModal as HTMLDialogElement).showModal();
                }
            },
        });
    };

    /**
     * Clear all local application data
     */
    const handleClearData = async () => {
        try {
            logger.debug("Clear Data button clicked");

            // Clear the TagDictionary database
            const tagDictionaryDB = new TagDictionaryDB();
            await tagDictionaryDB.deleteDatabase();

            localStorage.clear();

            const helpModal = document.getElementById("help_modal");
            if (helpModal) {
                (helpModal as HTMLDialogElement).close();
            }

            setAlertMsg(
                "All data has been cleared. The application will now reload."
            );
            setAlertType("alert-success");
            setShowAlert(true);

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            logger.error("Error clearing data:", error);
            setAlertMsg("Failed to clear data. Please try again.");
            setAlertType("alert-error");
            setShowAlert(true);
        }
    };

    return (
        <>
            <dialog
                id="help_modal"
                className="modal modal-bottom sm:modal-middle"
            >
                <div className="modal-box">
                    <h3 className="text-2xl font-bold">Help</h3>
                    <div className="py-4 text-lg font-semibold">
                        Dicom tag Editor Options
                    </div>
                    <ul>
                        <li>Edit tag values or remove tags</li>
                        <li>
                            Toggle between editing files individually or as a
                            series
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
                    <div className="mt-6 flex items-center justify-between">
                        <div className="dropdown dropdown-top">
                            <div tabIndex={0} role="button" className="btn">
                                Advanced Options
                                <ChevronUpIcon className="ml-2 h-6 w-6" />
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu dropdown-content z-[1] w-52 rounded-box bg-base-200 p-2 shadow"
                            >
                                <li className="hover:bg-base-200 hover:text-primary">
                                    <a
                                        onClick={() => {
                                            logger.debug(
                                                "Edit Tag Dictionary button clicked"
                                            );
                                            const helpModal =
                                                document.getElementById(
                                                    "help_modal"
                                                );
                                            if (helpModal) {
                                                (
                                                    helpModal as HTMLDialogElement
                                                ).close();
                                            }
                                            setShowDictEdit(true);
                                        }}
                                    >
                                        Edit Tag Dictionary
                                    </a>
                                </li>
                                <li className="hover:bg-base-200 hover:text-primary">
                                    <a
                                        onClick={() => {
                                            logger.debug(
                                                "Edit Auto-Anon Tags button clicked"
                                            );
                                            const helpModal =
                                                document.getElementById(
                                                    "help_modal"
                                                );
                                            if (helpModal) {
                                                (
                                                    helpModal as HTMLDialogElement
                                                ).close();
                                            }
                                            setAutoAnonTagsEditPanelVisible(
                                                true
                                            );
                                        }}
                                    >
                                        Edit Auto-Anon Tags
                                    </a>
                                </li>
                                <li className="hover:bg-base-200 hover:text-error">
                                    <a
                                        onClick={() => {
                                            const helpModal =
                                                document.getElementById(
                                                    "help_modal"
                                                );
                                            if (helpModal) {
                                                (
                                                    helpModal as HTMLDialogElement
                                                ).close();
                                            }
                                            confirmClearData();
                                        }}
                                    >
                                        Clear All Saved Data
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="modal-action m-0">
                            <form method="dialog">
                                <GenButton
                                    onClick={() => {
                                        logger.debug(
                                            "Close Help modal button clicked"
                                        );
                                        const helpModal =
                                            document.getElementById(
                                                "help_modal"
                                            );
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
        </>
    );
};
