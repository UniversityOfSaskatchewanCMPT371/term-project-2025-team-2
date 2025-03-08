import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "@components/Navigation/Sidebar";
import { Topbar } from "@navigation/Topbar";
import { FileUploader } from "./components/FileHandling/FileUploader";
import { DicomTable } from "./components/DicomData/TableComponents/DicomTable";
import { FileNavigation } from "./components/Navigation/FileNavigation";
import { FileHeader } from "./components/FileHandling/FileHeader";
import { CustomFile as CustomFile } from "./types/FileTypes";
import { Footer } from "./components/Navigation/Footer";
import { QuestionModal } from "./components/utils/Modals/QuestionModal";
import { Modal } from "./components/utils/Modals/Modal";
import logger from "./components/utils/Logger";
import { LoadingScreen } from "./components/utils/LoadingScreen";

import { useStore } from "./components/State/Store";
import { DicomData } from "./types/DicomTypes";

/**
 * @description Main App Function
 * @returns rendered App component
 */
export const App: React.FC = () => {
    const MAXSINGLEFILESDOWNLOAD = 15;

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

    const showSeriesModal = useStore((state) => state.showSeriesModal);
    const setShowSeiresModal = useStore((state) => state.setShowSeriesModal);

    const series = useStore((state) => state.series);
    const setSeries = useStore((state) => state.setSeries);

    const seriesSwitchModel = useStore((state) => state.seriesSwitchModel);
    const setSeriesSwitchModel = useStore(
        (state) => state.setSeriesSwitchModel
    );

    const setDownloadOption = useStore((state) => state.setDownloadOption);

    const emptyNewTagValues = useStore((state) => state.emptyNewTagValues);

    const showHiddenTags = useStore((state) => state.showHiddenTags);

    const theme = useStore((state) => state.theme);

    const clearData = useStore((state) => state.clearData);

    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    const sidebarRef = useRef<HTMLDivElement>(null);
    const sidebarButtonRef = useRef<HTMLButtonElement | null>(null);

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

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
        newFiles: CustomFile[],
        newDicomData: DicomData[]
    ) => {
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
            setShowSeiresModal(true);
        }
    };

    // File navigation - move to next file
    const nextFile = () => {
        if (currentFileIndex < files.length - 1) {
            setCurrentFileIndex(currentFileIndex + 1);
        }
    };

    // File navigation - move to previous file
    const prevFile = () => {
        if (currentFileIndex > 0) {
            setCurrentFileIndex(currentFileIndex - 1);
        }
    };

    // main render
    return (
        <div className="flex min-h-screen flex-col">
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

                {showSeriesModal ? (
                    <QuestionModal
                        setSeries={setSeries}
                        setIsOpen={setShowSeiresModal}
                        title={"Edit Files"}
                        text={
                            "Multiple files have been uploaded. Do you want to edit as a series?"
                        }
                    />
                ) : null}

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
                    onClose={() => setShowErrorModal(false)}
                    title="Error"
                    text="File isn't a valid DICOM file."
                />

                {sidebarVisible && (
                    <div ref={sidebarRef}>
                        <Sidebar isVisible={sidebarVisible} />
                    </div>
                )}
            </div>
            <Footer />

            {loading && <LoadingScreen />}
        </div>
    );
};

