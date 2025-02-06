import React, { useState } from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import FileUploader from "./components/FileUploader";
import DicomTable from "./components/DicomTable";

import log from 'loglevel';
import remote from 'loglevel-plugin-remote';

log.enableAll();
remote.apply(log, {
  url: "https://us-central1-data-a9e6d.cloudfunctions.net/app/add/msg",
  format: 'json',
});

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
      <Topbar toggleSidebar={toggleSidebar} sidebarVisible={sidebarVisible} />
      <div className="flex flex-1">
        <div className="flex-grow p-8">
          {files.length > 0 && dicomData.length > 0 && (
            <h2 className="mb-4 mt-4 text-xl text-gray-700">
              Currently Viewing: {files[currentFileIndex].name}
            </h2>
          )}

          <FileUploader onFileUpload={handleFileUpload} />

          {files.length > 0 && dicomData.length > 0 && (
            <div>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={prevFile}
                  disabled={currentFileIndex === 0}
                  className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-300"
                >
                  Previous
                </button>
                <button
                  onClick={nextFile}
                  disabled={currentFileIndex === files.length - 1}
                  className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-300"
                >
                  Next
                </button>
              </div>
              <DicomTable dicomData={dicomData[currentFileIndex]} />
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
