import React, { useState } from "react";

interface DicomTableProps {
  dicomData: { [key: string]: { tagName: string; value: string | any } }; // Expecting one file's dicom data here
}

const DicomTable: React.FC<DicomTableProps> = ({ dicomData }) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!dicomData) {
    return <div>No data available</div>;
  }

  const rows = Object.entries(dicomData).map(([tagId, tagData]) => ({
    tagId,
    tagName: tagData.tagName,
    value: tagData.value,
  }));

  const filteredRows = rows.filter(
    (row) =>
      row.tagId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.tagName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(row.value)
        ? row.value.some(
            (nestedRow: any) =>
              nestedRow.tagId
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              nestedRow.tagName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
          )
        : row.value.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold">DICOM Tags</h2>
      <input
        type="text"
        placeholder="Search tags..."
        className="mt-4 rounded border border-gray-300 p-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className="mt-4 min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Tag</th>
            <th className="border px-4 py-2">Tag Name</th>
            <th className="border px-4 py-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.length > 0 ? (
            filteredRows.map((row, index) => (
              <>
                <tr key={index + row.tagId}>
                  <td className="border px-4 py-2">{row.tagId}</td>
                  <td className="border px-4 py-2">{row.tagName}</td>
                  <td className="border px-4 py-2">
                    {Array.isArray(row.value) ? "" : row.value}
                  </td>
                </tr>
                {Array.isArray(row.value)
                  ? row.value.map((nestedRow: any, index: number) => (
                      <tr key={nestedRow.tagId + index}>
                        <td className="border bg-blue-200 px-4 py-2">
                          {nestedRow.tagId}
                        </td>
                        <td className="border px-4 py-2">
                          {nestedRow.tagName}
                        </td>
                        <td className="border px-4 py-2">{nestedRow.value}</td>
                      </tr>
                    ))
                  : null}
              </>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="px-4 py-2 text-center">
                No matching tags found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DicomTable;
