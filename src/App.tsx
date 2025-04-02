import React, { useState, useEffect, useRef, lazy } from "react";
import { Topbar } from "@components/Navigation/Topbar";
const Sidebar = lazy(() => import("@components/Navigation/Sidebar"));
const FileUploader = lazy(
    () => import("./Features/FileHandling/Components/FileUploader")
);
const DicomTable = lazy(
    () => import("./Features/DicomTagTable/Components/DicomTable")
);

import { FileNavigation } from "@components/Navigation/FileNavigation";
import { FileHeader } from "./Features/FileHandling/Components/FileHeader";
import { FileData } from "./Features/FileHandling/Types/FileTypes";
import { Footer } from "@components/Navigation/Footer";
import { QuestionModal } from "./Components/utils/Modals/QuestionModal";
import { Modal } from "@components/utils/Modals/Modal";
import logger from "./Logger/Logger";
import { LoadingScreen } from "@components/utils/LoadingScreen";
import { SidePanel } from "@auto/Components/AutoConfirmPanel";
import { AlertHeader } from "@components/utils/alertHeader";
import { useQuestionModalStore } from "@state/QuestionModalStore";

import { useStore } from "@state/Store";
import { DicomData } from "./Features/DicomTagTable/Types/DicomTypes";
import { assert } from "./DataFunctions/assert";

const AutoAnonTagsEdit = lazy(
    () => import("@components/Navigation/AutoAnonTagsEdit")
);
const DictTagsEdit = lazy(() => import("@features/TagDictEditor/DictTagsEdit"));

import { HelpModal } from "@components/utils/Modals/HelpModal";

/**
 * @description Main App Function
 * @returns rendered App component
 */
export const App: React.FC = () => {
    const MAXSINGLEFILESDOWNLOAD = 15;

    // Load tag dictionary on app start
    useStore.getState().loadTagDictionary();

    const files = useStore((state) => state.files);
    const setFiles = useStore((state) => state.setFiles);

    const dicomData = useStore((state) => state.dicomData);
    const setDicomData = useStore((state) => state.setDicomData);

    const currentFileIndex = useStore((state) => state.currentFileIndex);
    const setCurrentFileIndex = useStore((state) => state.setCurrentFileIndex);

    const loading = useStore((state) => state.loading);
    const setLoading = useStore((state) => state.setLoading);

    const showErrorModal = useStore((state) => state.showErrorModal);
    const showError = useStore((state) => state.showError);
    const setShowErrorModal = useStore((state) => state.setShowErrorModal);

    const sidebarVisible = useStore((state) => state.sidebarVisible);
    const setSidebarVisible = useStore((state) => state.setSidebarVisible);

    const series = useStore((state) => state.series);
    const setSeries = useStore((state) => state.setSeries);

    const openModal = useQuestionModalStore((state) => state.openModal);

    const seriesSwitchModel = useStore((state) => state.seriesSwitchModel);
    const setSeriesSwitchModel = useStore(
        (state) => state.setSeriesSwitchModel
    );

    const setDownloadOption = useStore((state) => state.setDownloadOption);

    const emptyNewTagValues = useStore((state) => state.emptyNewTagValues);

    const showHiddenTags = useStore((state) => state.showHiddenTags);

    const theme = useStore((state) => state.theme);

    const showAlert = useStore((state) => state.showAlert);
    const setShowAlert = useStore((state) => state.setShowAlert);
    const alertRef = useRef<HTMLDivElement>(null);

    const clearData = useStore((state) => state.clearData);

    const fileParseError = useStore((state) => state.fileParseErrorFileNames);
    const setFileParseError = useStore(
        (state) => state.setFileParseErrorFileNames
    );

    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    const sidebarRef = useRef<HTMLDivElement>(null);
    const sidebarButtonRef = useRef<HTMLButtonElement | null>(null);

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    logger.info("App: App component rendered");
    logger.info(`App: Theme loaded as to ${theme}`);
    logger.info(`App: Show hidden tags loaded as to ${showHiddenTags}`);

    // Save theme on change, set theme on load
    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.querySelector("html")?.setAttribute("data-theme", theme);
    }, [theme]);

    // Save show hidden tags on change
    useEffect(() => {
        localStorage.setItem("showHiddenTags", JSON.stringify(showHiddenTags));
    }, [showHiddenTags]);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node) &&
                sidebarButtonRef.current &&
                !sidebarButtonRef.current.contains(event.target as Node)
            ) {
                setSidebarVisible(false);
            }
            logger.info("App: Sidebar closed clicking outside");
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                alertRef.current &&
                !alertRef.current.contains(event.target as Node)
            ) {
                setShowAlert(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });

    // PWA installation prompt
    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            logger.debug("PWA: Install prompt captured and ready");
        };

        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt
        );

        if (import.meta.env.DEV) {
            logger.debug("PWA: Running in development mode");
        }

        window.addEventListener("appinstalled", () => {
            setDeferredPrompt(null);
            logger.debug("PWA: Application was installed");
        });

        return () => {
            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstallPrompt
            );
        };
    }, []);

    // PWA installation prompt click handler
    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            logger.info("PWA: No installation prompt available");
            return;
        }

        try {
            const promptEvent = deferredPrompt as any;
            promptEvent.prompt();

            const { outcome } = await promptEvent.userChoice;
            logger.info(`PWA: User response to the install prompt: ${outcome}`);

            setDeferredPrompt(null);
        } catch (err) {
            logger.error("PWA: Error during installation:", err);
        }
    };

    // File handling
    const handleFileUpload = (
        newFiles: FileData[],
        newDicomData: DicomData[]
    ) => {
        logger.info("App: File upload started");
        setFiles(newFiles);
        setDicomData(newDicomData);
        setCurrentFileIndex(0);
        emptyNewTagValues();

        logger.debug("file-loaded");
        setLoading(false);

        // If more than 15 files, set download option to zip
        // downloading to many files at once can cause files to be skipped
        // state needs to be made global to limit user changing download option
        // in settings
        if (newFiles.length > MAXSINGLEFILESDOWNLOAD) {
            setDownloadOption("zip");
        }

        if (newFiles.length > 1) {
            openModal({
                title: "Edit Files",
                text: "Multiple files have been uploaded. Do you want to edit as a series?",
                onConfirm: () => {
                    setSeries(true);
                },
                onCancel: () => {
                    setSeries(false);
                },
            });
        }

        assert(newFiles.length === newDicomData.length);
        assert(currentFileIndex === 0);
    };

    // File navigation - move to next file
    const nextFile = () => {
        logger.debug(`App: Next file button clicked: ${currentFileIndex}`);
        if (currentFileIndex < files.length - 1) {
            setCurrentFileIndex(currentFileIndex + 1);
        }
        assert(currentFileIndex < files.length);
    };

    // File navigation - move to previous file
    const prevFile = () => {
        logger.debug(`App: Previous file button clicked: ${currentFileIndex}`);
        if (currentFileIndex > 0) {
            setCurrentFileIndex(currentFileIndex - 1);
        }
        assert(currentFileIndex >= 0);
    };

    // main render
    return (
        <div className="flex min-h-screen flex-col">
            {showAlert ? (
                <div ref={alertRef}>
                    <AlertHeader />
                </div>
            ) : null}

            <Topbar
                toggleSidebar={toggleSidebar}
                sidebarVisible={sidebarVisible}
                sidebarButtonRef={sidebarButtonRef}
                onInstallClick={handleInstallClick}
                showInstallButton={!!deferredPrompt}
            />

            <div className="flex flex-1">
                <div className="flex-grow p-8">
                    <>
                        <FileUploader
                            onFileUpload={handleFileUpload}
                            loading={setLoading}
                            clearData={clearData}
                            toggleModal={showError}
                        />

                        <FileHeader
                            files={files}
                            currentFileIndex={currentFileIndex}
                        />
                    </>

                    {files.length > 1 && !series ? (
                        <FileNavigation
                            currentFileIndex={currentFileIndex}
                            fileCount={files.length}
                            onPrevFile={prevFile}
                            onNextFile={nextFile}
                        />
                    ) : null}

                    {files.length > 0 && dicomData.length > 0 && (
                        <div>
                            <DicomTable />
                        </div>
                    )}
                </div>

                <QuestionModal />

                <Modal
                    isOpen={seriesSwitchModel}
                    onClose={() => setSeriesSwitchModel(false)}
                    title={"Switch to Series"}
                    text={
                        "Multiple files have been edited. Displayed files edited tags will be applied to all files"
                    }
                />

                <Modal
                    isOpen={showErrorModal}
                    onClose={() => {
                        setShowErrorModal(false);
                        setFileParseError([]);
                    }}
                    title="Error"
                    text={`File ${fileParseError} isn't a valid DICOM file.`}
                />

                {sidebarVisible && (
                    <div ref={sidebarRef}>
                        <Sidebar isVisible={sidebarVisible} />
                    </div>
                )}

                <SidePanel />
                <AutoAnonTagsEdit />
                <DictTagsEdit />
                <HelpModal />
            </div>
            <Footer />

            {loading && <LoadingScreen />}
        </div>
    );
};
