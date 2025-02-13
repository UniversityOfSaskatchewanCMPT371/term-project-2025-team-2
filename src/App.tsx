import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Navigation/Sidebar";
import Topbar from "./components/Navigation/Topbar";
import FileUploader from "./components/FileHandling/FileUploader";
import DicomTable from "./components/DicomData/DicomTable";
import { FileNavigation } from "./components/Navigation/FileNavigation";
import { FileHeader } from "./components/FileHandling/FileHeader";
import log from "./components/utils/Logger";
import Footer from "./components/Navigation/Footer";

/**
 *
 * @returns rendered App component
 */
const App: React.FC = () => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [dicomData, setDicomData] = useState<any[]>([]);
    const [currentFileIndex, setCurrentFileIndex] = useState<number>(0);

    const [isOpen, setIsOpen] = useState(false);
    const [series, setSeries] = useState(false);

    const [theme, setTheme] = useState(
        localStorage.getItem("theme") ?? "corporate"
    );

    const [newTableData, setNewTableData] = useState<any[]>([]);

    const updateTableData = (newData: any) => {
        setNewTableData((prevData) => [...prevData, newData]);
    };

    const sidebarRef = useRef<HTMLDivElement | null>(null);

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
            const target = event.target as HTMLElement;
            // Don't close if clicking the toggle button (it has its own handler)
            if (target.closest('[data-sidebar-toggle]')) {
                return;
            }
            
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node)
            ) {
                setSidebarVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleFileUpload = (newFiles: File[], newDicomData: any[]) => {
        setFiles(newFiles);
        setDicomData(newDicomData);
        setCurrentFileIndex(0);

        log.info("file-loaded");
        if (newFiles.length > 1) {
            setIsOpen(true);
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

    return (
        <div className="flex min-h-screen flex-col bg-base-100">
            <Topbar
                toggleSidebar={toggleSidebar}
                sidebarVisible={sidebarVisible}
                toggleTheme={handleToggle}
            />

            <div className="flex flex-1">
                <div className="flex-grow p-4 md:p-8">
                    <div className="container mx-auto max-w-7xl space-y-6">
                        <FileUploader onFileUpload={handleFileUpload} />

                        {files.length > 0 && (
                            <div className="rounded-xl bg-base-200 p-6 shadow-lg border [data-theme='night']:border-blue-500 [data-theme='corporate']:border-base-300">
                                <FileHeader
                                    files={files}
                                    currentFileIndex={currentFileIndex}
                                />
                                {files.length > 1 && !series && (
                                    <div className="mt-4">
                                        <FileNavigation
                                            currentFileIndex={currentFileIndex}
                                            fileCount={files.length}
                                            onPrevFile={prevFile}
                                            onNextFile={nextFile}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {files.length > 0 && dicomData.length > 0 && (
                            <div className="rounded-xl bg-base-200 p-6 shadow-lg border [data-theme='night']:border-blue-500 [data-theme='corporate']:border-base-300">
                                <DicomTable
                                    dicomData={dicomData[currentFileIndex]}
                                    fileName={files[currentFileIndex].name}
                                    updateTableData={updateTableData}
                                    newTableData={newTableData}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div
                            className="w-full max-w-sm rounded-xl bg-base-100 p-8 shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h4 className="text-2xl font-semibold text-base-content">
                                Editing Option
                            </h4>
                            <p className="my-6 text-base-content/80">
                                Would you like to edit these files as a series?
                            </p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => {
                                        setSeries(true);
                                        setIsOpen(false);
                                    }}
                                    className="rounded-lg bg-primary px-6 py-2 text-primary-content transition hover:bg-primary-focus"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => {
                                        setSeries(false);
                                        setIsOpen(false);
                                    }}
                                    className="rounded-lg bg-error px-6 py-2 text-error-content transition hover:bg-error-focus"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {sidebarVisible && (
                    <div ref={sidebarRef} className="shadow-2xl">
                        <Sidebar
                            files={files}
                            onFileSelect={handleFileSelect}
                            currentFileIndex={currentFileIndex}
                            series={series}
                            seriesToggle={() => setSeries(!series)}
                        />
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default App;
