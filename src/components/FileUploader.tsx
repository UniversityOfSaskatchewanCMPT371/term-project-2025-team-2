import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { parseDicomFile } from "./dicomParserUtils"; // Import the utility function

interface FileUploaderProps {
  onFileUpload: (files: File[], dicomData: any[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      console.log(files);
      const fileArray = Array.from(selectedFiles);
      setFiles(fileArray);
      processFiles(fileArray);
    }
  };

  const processFiles = (fileArray: File[]) => {
    const dicomDataArray: any[] = [];

    fileArray.forEach((file) => {
      parseDicomFile(file)
        .then((dicomData) => {
          dicomDataArray.push(dicomData);
          if (dicomDataArray.length === fileArray.length) {
            onFileUpload(fileArray, dicomDataArray);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    processFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/dicom": [".dcm"] },
    multiple: true,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className="relative min-h-[200px] cursor-pointer rounded-lg border-2 border-dashed border-blue-500 px-5 py-10 text-center"
      >
        <input {...getInputProps()} />
        <p>
          Drag and drop DICOM files here, or click the button below to select
          files
        </p>

        <button
          onClick={(e) => e.preventDefault()}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer rounded border-0 bg-blue-500 px-5 py-2 text-white"
        >
          Select Files
        </button>
      </div>
      <input
        type="file"
        accept=".dcm"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default FileUploader;
