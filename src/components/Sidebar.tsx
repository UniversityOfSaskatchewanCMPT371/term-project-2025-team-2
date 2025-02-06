import React from "react";

interface SidebarProps {
  files: File[];
  onFileSelect: (index: number) => void;
  currentFileIndex: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  files,
  onFileSelect,
  currentFileIndex,
}) => {
  return (
    <div className="fixed right-0 top-0 h-full w-64 bg-blue-700 p-6 text-white">
      <h3 className="mb-6 mt-20 text-xl font-semibold">Sidebar</h3>
      <ul className="space-y-4">
        <li>
          <a href="#" className="hover:text-blue-400">
            Home
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-blue-400">
            About
          </a>
        </li>
      </ul>

      <div className="mt-8">
        <h4 className="text-lg font-semibold">Uploaded Files</h4>
        <ul className="mt-4">
          {files.length > 0 ? (
            files.map((file, index) => (
              <li
                key={index}
                className={`cursor-pointer text-gray-300 hover:text-blue-400 ${
                  index === currentFileIndex ? "bg-black-500 text-white" : ""
                }`}
                onClick={() => onFileSelect(index)}
              >
                {file.name}
              </li>
            ))
          ) : (
            <li className="text-gray-400">No files uploaded</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
