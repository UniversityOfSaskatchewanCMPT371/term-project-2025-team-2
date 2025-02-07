import React from 'react';

interface FileHeaderProps {
  files: File[];
  currentFileIndex: number;
}

export const FileHeader: React.FC<FileHeaderProps> = ({ 
  files, 
  currentFileIndex 
}) => {
  if (files.length === 0) return null;

  return (
    <h2 className="mb-4 mt-4 text-xl text-gray-700">
      Currently Viewing: {files[currentFileIndex].name}
    </h2>
  );
};
