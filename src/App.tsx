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

    const [theme, setTheme] = useState(
        localStorage.getItem("theme") ?? "corporate"
    );

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

    const handleFileUpload = (newFiles: File[], newDicomData: any[]) => {
        setFiles(newFiles);
        setDicomData(newDicomData);
        setCurrentFileIndex(0);

        log.info("file-loaded");
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

                    {files.length > 0 && dicomData.length > 0 && (
                        <div>
                            <FileNavigation
                                currentFileIndex={currentFileIndex}
                                fileCount={files.length}
                                onPrevFile={prevFile}
                                onNextFile={nextFile}
                            />
                            <DicomTable
                                dicomData={dicomData[currentFileIndex]}
                                fileName={files[currentFileIndex].name}
                            />
                        </div>
                    )}
                </div>

                {sidebarVisible && (

                    <div ref={sidebarRef}>
                        <Sidebar
                            files={files}
                            onFileSelect={handleFileSelect}
                            currentFileIndex={currentFileIndex}
                        />
                    </div>

                )}
            </div>
            <Footer />
        </div>
    );
};

export default App;
