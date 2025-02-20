import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Navigation/Sidebar";
import Topbar from "./components/Navigation/Topbar";
import FileUploader from "./components/FileHandling/FileUploader";
import DicomTable from "./components/DicomData/DicomTable";
import { FileNavigation } from "./components/Navigation/FileNavigation";
import FileHeader from "./components/FileHandling/FileHeader";
import log from "./components/utils/Logger";
import { CustomFile as CustomFile } from "./types/types";
import Footer from "./components/Navigation/Footer";
import QuestionModal from "./components/utils/QuestionModal";
import Modal from "./components/utils/Modal";
import {
    tagUpdater,
    downloadDicomFile,
    getSingleFileTagEdits,
} from "./components/DicomData/TagUpdater";

/**
 *
 * @returns rendered App component
 */
const App: React.FC = () => {
    const [files, setFiles] = useState<CustomFile[]>([]);
    const [dicomData, setDicomData] = useState<any[]>([]);
    const [currentFileIndex, setCurrentFileIndex] = useState<number>(0);

    const [sidebarVisible, setSidebarVisible] = useState(false);

    const [showSeriesModal, setShowSeiresModal] = useState(false);
    const [series, setSeries] = useState(false);

    const [seriesSwitchModel, setSeriesSwitchModel] = useState(false);

    const [theme, setTheme] = useState(
        localStorage.getItem("theme") ?? "corporate"
    );

    const [newTableData, setNewTableData] = useState<any[]>([]);

    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    const updateTableData = (newData: any) => {
        setNewTableData((prevData) => [...prevData, newData]);
    };

    const sidebarRef = useRef<HTMLDivElement>(null);
    const sidebarButtonRef = useRef<HTMLButtonElement | null>(null);

    const handleToggle = (e: any) => {
        if (e.target.checked) {
            setTheme("corporate");
        } else {
            setTheme("night");
        }
    };

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    useEffect(() => {
        localStorage.setItem("theme", theme!);
        const localTheme = localStorage.getItem("theme");
        document.querySelector("html")?.setAttribute("data-theme", localTheme!);
    }, [theme]);

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
    }, []);

    // PWA installation prompt
    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            console.log("PWA: Install prompt captured and ready");
        };

        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt
        );

        if (import.meta.env.DEV) {
            console.log("PWA: Running in development mode");
        }

        window.addEventListener("appinstalled", () => {
            setDeferredPrompt(null);
            console.log("PWA: Application was installed");
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
            console.log("PWA: No installation prompt available");
            return;
        }

        try {
            const promptEvent = deferredPrompt as any;
            promptEvent.prompt();

            const { outcome } = await promptEvent.userChoice;
            console.log(`PWA: User response to the install prompt: ${outcome}`);

            setDeferredPrompt(null);
        } catch (err) {
            console.error("PWA: Error during installation:", err);
        }
    };

    // File handling
    const handleFileUpload = (newFiles: CustomFile[], newDicomData: any[]) => {
        setFiles(newFiles);
        setDicomData(newDicomData);
        setCurrentFileIndex(0);
        setNewTableData([]);

        log.info("file-loaded");
        if (newFiles.length > 1) {
            setShowSeiresModal(true);
        }
    };

    const nextFile = () => {
        if (currentFileIndex < files.length - 1) {
            setCurrentFileIndex(currentFileIndex + 1);
        }
    };

    const prevFile = () => {
        if (currentFileIndex > 0) {
            setCurrentFileIndex(currentFileIndex - 1);
        }
    };

    const handleFileSelect = (index: number) => {
        setCurrentFileIndex(index);
    };

    // Clear all data, files, tags, and new tags
    const clearData = () => {
        setFiles([]);
        setDicomData([]);
        setCurrentFileIndex(0);
        setNewTableData([]);
        setSeries(false);
    };

    const toggleSeries = () => {
        setSeries(!series);

        if (!series) {
            newTableData.forEach((entry) => {
                if (entry.fileName !== files[currentFileIndex].name) {
                    setSidebarVisible(false);
                    setSeriesSwitchModel(true);
                }
            });
        }
    };

    // Update all files with new tags, handle series and individual file editing
    const updateAllFiles = () => {

        if (series) {
            dicomData.forEach((dicom, index) => {
                const updatedFile = tagUpdater(
                    dicom.DicomDataSet,
                    getSingleFileTagEdits(newTableData, files[currentFileIndex].name),
                );
                downloadDicomFile(updatedFile, files[index].name);
            });

        } else {

            dicomData.forEach((dicom, index) => {
                const updatedFile = tagUpdater(
                    dicom.DicomDataSet,
                    getSingleFileTagEdits(newTableData, files[index].name),
                );
                downloadDicomFile(updatedFile, files[index].name);
            });

        }
        
        setSidebarVisible(false);
        clearData();
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Topbar
                toggleSidebar={toggleSidebar}
                sidebarVisible={sidebarVisible}
                toggleTheme={handleToggle}
                sidebarButtonRef={sidebarButtonRef}
                onInstallClick={handleInstallClick}
                showInstallButton={!!deferredPrompt}
                currTheme={theme}
            />

            <div className="flex flex-1">
                <div className="flex-grow p-8">
                    <FileUploader onFileUpload={handleFileUpload} />

                    <FileHeader
                        files={files}
                        currentFileIndex={currentFileIndex}
                    />
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
                            <DicomTable
                                dicomData={dicomData[currentFileIndex]}
                                fileName={files[currentFileIndex].name}
                                updateTableData={updateTableData}
                                newTableData={newTableData}
                                clearData={clearData}
                            />
                        </div>
                    )}
                </div>

                {showSeriesModal ? (
                    <QuestionModal
                        setSeries={setSeries}
                        setIsOpen={setShowSeiresModal}
                        title={"Edit Files"}
                        text={
                            "Multiple files have been uploaded. Do you want to edit them as a series?"
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

                {sidebarVisible && (
                    <div ref={sidebarRef}>
                        <Sidebar
                            files={files}
                            onFileSelect={handleFileSelect}
                            currentFileIndex={currentFileIndex}
                            series={series}
                            seriesToggle={toggleSeries}
                            isVisible={sidebarVisible}
                            updateAllFiles={updateAllFiles}
                        />
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default App;
