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

/**
 *
 * @returns rendered App component
 */
const App: React.FC = () => {
    const [files, setFiles] = useState<CustomFile[]>([]);
    const [dicomData, setDicomData] = useState<any[]>([]);
    const [currentFileIndex, setCurrentFileIndex] = useState<number>(0);

    const [sidebarVisible, setSidebarVisible] = useState(false);

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

    const handleFileUpload = (newFiles: CustomFile[], newDicomData: any[]) => {
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
        <div className="flex min-h-screen flex-col">
            <Topbar
                toggleSidebar={toggleSidebar}
                sidebarVisible={sidebarVisible}
                toggleTheme={handleToggle}
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
                            />
                        </div>
                    )}
                </div>

                {isOpen ? (
                    <QuestionModal
                        setSeries={setSeries}
                        setIsOpen={setIsOpen}
                    />
                ) : null}

                {sidebarVisible && (
                    <Sidebar
                        files={files}
                        onFileSelect={handleFileSelect}
                        currentFileIndex={currentFileIndex}
                        series={series}
                        seriesToggle={() => setSeries(!series)}
                        isVisible={sidebarVisible}
                    />
                )}
            </div>
            <Footer />
        </div>
    );
};

export default App;
