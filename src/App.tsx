import React, { useState } from "react";
import Sidebar from "./components/Navingation/Sidebar";
import Topbar from "./components/Navingation/Topbar";
import FileUploader from "./components/FileHandling/FileUploader";
import DicomTable from "./components/DicomData/DicomTable";
import { FileNavigation } from "./components/Navingation/FileNavigation";
import { FileHeader } from "./components/FileHandling/FIleHandler";
import log from "./components/utils/Logger";

const App: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [dicomData, setDicomData] = useState<any[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(0);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

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
      />
      <div className="flex flex-1">
        <div className="flex-grow p-8">
          <FileHeader files={files} currentFileIndex={currentFileIndex} />

          <FileUploader onFileUpload={handleFileUpload} />

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
              />
            </div>
          )}
        </div>

        {sidebarVisible && (
          <Sidebar
            files={files}
            onFileSelect={handleFileSelect}
            currentFileIndex={currentFileIndex}
          />
        )}
      </div>
    </div>
  );
};

export default App;
