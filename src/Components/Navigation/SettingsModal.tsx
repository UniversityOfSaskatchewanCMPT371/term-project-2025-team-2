import React from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { GenButton } from "../utils/GenButton";
import { DownloadOption } from "../utils/DownloadOption";
import { SettingsModalProps } from "@type/types";
import { HiddenTagsOption } from "./HiddenTagsOption";
import { ThemeSelector } from "./ThemeSelector";
import logger from "../../Logger/Logger";
import { useStore } from "@state/Store";
import { EditOption } from "@components/utils/EditOption";

/**
 * SettingsModal component for managing application settings
 * @component
 * @precondition SettingsModal component expects the following props
 * @postcondition SettingsModal component renders a modal to manage application settings
 * @param {SettingsModalProps} props - Component props
 * @param {() => void} props.toggleModal - Function to toggle the modal visibility
 * @returns {JSX.Element} Rendered SettingsModal component
 */
export const SettingsModal: React.FC<SettingsModalProps> = ({
    toggleModal,
}) => {
    const showHiddenTags = useStore((state) => state.showHiddenTags);
    const setShowHiddenTags = useStore((state) => state.setShowHiddenTags);
    const setAutoAnonTagsEditPanelVisible = useStore(
        (state) => state.setAutoAnonTagsEditPanelVisible
    );

    logger.debug("Rendering SettingsModal component");

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

                <ThemeSelector />
                <HiddenTagsOption
                    showHiddenTags={showHiddenTags}
                    setShowHiddenTags={setShowHiddenTags}
                />

                <p>Download Option</p>
                <DownloadOption />

                <p>Editing Locked Tags</p>
                <EditOption />

                <div className="mb-4">
                    <GenButton
                        onClick={() => {
                            logger.debug("Edit Auto-Anon Tags button clicked");
                            setAutoAnonTagsEditPanelVisible(true);
                        }}
                        disabled={false}
                        label="Edit Auto-Anon Tags"
                    />
                </div>

                <GenButton
                    onClick={toggleModal}
                    disabled={false}
                    label="Close"
                />
            </div>
        </div>
    );
};
