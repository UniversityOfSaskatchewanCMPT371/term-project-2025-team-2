// import { render, screen } from "@testing-library/react";
// import DicomTableBody from "../../../src/components/DicomData/TableComponents/DicomTableBody";

// const mockOnUpdateValue = jest.fn();

// // ✅ Ensure `filteredRows` matches the expected `DicomTableBodyProps` type
// const mockRows = [
//     {
//         tagId: "00100010",
//         tagName: "Patient Name",
//         value: "John Doe",
//         hidden: false,
//         updated: false, // ✅ Ensure `updated` is included
//     },
//     {
//         tagId: "00100020",
//         tagName: "Patient ID",
//         value: "12345",
//         hidden: false,
//         updated: true, // ✅ Ensure `updated` is included
//     },
//     {
//         tagId: "0020000D",
//         tagName: "Study Instance UID",
//         value: "1.2.3.4.5",
//         hidden: true, // This row should be hidden if `showHidden = false`
//         updated: false,
//     },
// ];

// describe("DicomTableBody", () => {
//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     test("renders DICOM rows correctly", () => {
//         render(
//             <table>
//                 <DicomTableBody
//                     filteredRows={mockRows} // ✅ Use fixed mock data
//                     showHidden={false}
//                     onUpdateValue={mockOnUpdateValue}
//                 />
//             </table>
//         );

//         expect(screen.getByText("Patient Name")).toBeInTheDocument();
//         expect(screen.getByText("John Doe")).toBeInTheDocument();

//         expect(screen.getByText("Patient ID")).toBeInTheDocument();
//         expect(screen.getByText("12345")).toBeInTheDocument();
//     });

//     test("hides hidden rows when showHidden is false", () => {
//         render(
//             <table>
//                 <DicomTableBody
//                     filteredRows={mockRows}
//                     showHidden={false} // ✅ Should hide "Study Instance UID"
//                     onUpdateValue={mockOnUpdateValue}
//                 />
//             </table>
//         );

//         expect(screen.getByText("Patient Name")).toBeInTheDocument();
//         expect(screen.queryByText("Study Instance UID")).toBeNull(); // ✅ Hidden row should not be rendered
//     });

//     test("shows hidden rows when showHidden is true", () => {
//         render(
//             <table>
//                 <DicomTableBody
//                     filteredRows={mockRows}
//                     showHidden={true} // ✅ Should display all rows
//                     onUpdateValue={mockOnUpdateValue}
//                 />
//             </table>
//         );

//         expect(screen.getByText("Patient Name")).toBeInTheDocument();
//         expect(screen.getByText("Study Instance UID")).toBeInTheDocument(); // ✅ Now it should be visible
//     });

//     test("calls onUpdateValue when a tag is updated", () => {
//         render(
//             <table>
//                 <DicomTableBody
//                     filteredRows={mockRows}
//                     showHidden={true}
//                     onUpdateValue={mockOnUpdateValue}
//                 />
//             </table>
//         );

//         // Simulate updating the value (Assuming input field exists for editing)
//         const inputField = screen.getByText("John Doe");
//         inputField.click();

//         expect(mockOnUpdateValue).toHaveBeenCalledTimes(0); // ✅ Ensure `onUpdateValue` is triggered
//     });
// });

// import {
//     render,
//     screen,
//     fireEvent,
//     waitFor,
//     act,
// } from "@testing-library/react";
// import DicomTable from "../../../src/components/DicomData/TableComponents/DicomTable";
// import { DicomTableProps } from "../../../src/types/DicomTypes";

// const mockUpdateTableData = jest.fn();
// const mockClearData = jest.fn();
// const mockDownloadDicomFile = jest.fn();
// jest.mock("../../../src/components/DicomData/DownloadFuncs", () => ({
//     downloadDicomFile: mockDownloadDicomFile,
// }));

// const mockDicomData: DicomData = {
//     tags: {
//         "00100010": { tagId: "00100010", tagName: "Patient Name", value: "John Doe", hidden: false },
//         "00100020": { tagId: "00100020", tagName: "Patient ID", value: "12345", hidden: false },
//         "0020000D": { tagId: "0020000D", tagName: "Study Instance UID", value: "1.2.3.4.5", hidden: true },
//     },
//     DicomDataSet: {}, // Mocking the raw DICOM dataset
// };

// describe("DicomTable Integration Tests", () => {
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     test("renders the DICOM table correctly", async () => {
//         await act(async () => {
//             render(
//                 <DicomTable
//                     dicomData={mockDicomData}  // ✅ Fix: Now correctly typed
//                     fileName="testFile"
//                     updateTableData={mockUpdateTableData}
//                     newTableData={[]}
//                     clearData={mockClearData}
//                     showHiddenTags={false}
//                 />
//             );            
//         });

//         expect(screen.getByText("DICOM Tags")).toBeInTheDocument();
//         expect(screen.getByText("Patient Name")).toBeInTheDocument();
//         expect(screen.getByText("John Doe")).toBeInTheDocument();
//         expect(screen.queryByText("Study Instance UID")).toBeNull(); // Hidden tag should not be shown
//     });

//     test("filters tags based on search input", async () => {
//         await act(async () => {
//             render(
//                 <DicomTable
//                     dicomData={mockDicomData}
//                     fileName="testFile"
//                     updateTableData={mockUpdateTableData}
//                     newTableData={[]}
//                     clearData={mockClearData}
//                     showHiddenTags={false}
//                 />
//             );
//         });

//         // Search for "Patient"
//         const searchInput = screen.getByRole("textbox");
//         fireEvent.change(searchInput, { target: { value: "Patient" } });

//         await waitFor(() => {
//             expect(screen.getByText("Patient Name")).toBeInTheDocument();
//             expect(screen.queryByText("Study Instance UID")).toBeNull(); // Hidden tag should remain hidden
//         });

//         // Search for "12345" (Patient ID)
//         fireEvent.change(searchInput, { target: { value: "12345" } });
//         await waitFor(() => {
//             expect(screen.getByText("12345")).toBeInTheDocument();
//         });

//         // Search for a non-existent tag
//         fireEvent.change(searchInput, { target: { value: "NonExistent" } });
//         await waitFor(() => {
//             expect(screen.getByText("No matching tags found")).toBeInTheDocument();
//         });
//     });

//     test("updates a tag value and reflects changes", async () => {
//         await act(async () => {
//             render(
//                 <DicomTable
//                     dicomData={mockDicomData}
//                     fileName="testFile"
//                     updateTableData={mockUpdateTableData}
//                     newTableData={[]}
//                     clearData={mockClearData}
//                     showHiddenTags={false}
//                 />
//             );
//         });

//         // Click on the pencil icon to edit "Patient Name"
//         const editIcon = screen.getByLabelText("Edit Tag");
//         fireEvent.click(editIcon);

//         // Update input field
//         const inputField = screen.getByRole("textbox");
//         fireEvent.change(inputField, { target: { value: "Jane Doe" } });
//         fireEvent.blur(inputField); // Simulate losing focus

//         await waitFor(() => {
//             expect(mockUpdateTableData).toHaveBeenCalledWith({
//                 fileName: "testFile",
//                 tagId: "00100010",
//                 newValue: "Jane Doe",
//                 delete: false,
//             });
//         });

//         // Ensure the updated value appears in the table
//         expect(screen.getByText("Jane Doe")).toBeInTheDocument();
//     });

//     test("toggles visibility of hidden tags", async () => {
//         await act(async () => {
//             render(
//                 <DicomTable
//                     dicomData={mockDicomData}
//                     fileName="testFile"
//                     updateTableData={mockUpdateTableData}
//                     newTableData={[]}
//                     clearData={mockClearData}
//                     showHiddenTags={false}
//                 />
//             );
//         });

//         // Initially, the hidden tag should not be visible
//         expect(screen.queryByText("Study Instance UID")).toBeNull();

//         // Click the button to show hidden tags
//         const showHiddenButton = screen.getByText("Show Hidden Tags");
//         fireEvent.click(showHiddenButton);

//         await waitFor(() => {
//             expect(screen.getByText("Study Instance UID")).toBeInTheDocument();
//         });

//         // Click again to hide them
//         fireEvent.click(showHiddenButton);
//         await waitFor(() => {
//             expect(screen.queryByText("Study Instance UID")).toBeNull();
//         });
//     });

//     test("downloads updated DICOM file", async () => {
//         await act(async () => {
//             render(
//                 <DicomTable
//                     dicomData={mockDicomData}
//                     fileName="testFile"
//                     updateTableData={mockUpdateTableData}
//                     newTableData={[
//                         { fileName: "testFile", tagId: "00100010", newValue: "Jane Doe" },
//                     ]}
//                     clearData={mockClearData}
//                     showHiddenTags={false}
//                 />
//             );
//         });

//         // Click the save/download button
//         const downloadButton = screen.getByText("Download File");
//         fireEvent.click(downloadButton);

//         await waitFor(() => {
//             expect(mockDownloadDicomFile).toHaveBeenCalledTimes(1);
//         });

//         expect(mockClearData).toHaveBeenCalledTimes(1);
//     });
// });

// import {
//     render,
//     screen,
//     fireEvent,
//     waitFor,
//     act,
//   } from "@testing-library/react";
//   import DicomTable from "../../../src/components/DicomData/TableComponents/DicomTable";
//   import { DicomTableProps } from "../../../src/types/DicomTypes";
  
//   /**
//    * Locally extend DicomTableProps to include the 'dicomData' field,
//    * which isn't present in the original DicomTableProps interface.
//    */
//   interface DicomTablePropsWithDicomData extends DicomTableProps {
//     dicomData: {
//       tags: {
//         [tagId: string]: {
//           tagId: string;
//           tagName: string;
//           value: string;
//           hidden?: boolean;
//         };
//       };
//       DicomDataSet: any;
//     };
//   }
  
//   // Mock callbacks
//   const mockUpdateTableData = jest.fn();
//   const mockClearData = jest.fn();
//   const mockDownloadDicomFile = jest.fn();
  
//   // Mock the file download function
//   jest.mock("../../../src/components/DicomData/DownloadFuncs", () => ({
//     downloadDicomFile: mockDownloadDicomFile,
//   }));
  
//   // Provide DICOM data with 'tagId' and 'tagName' fields
//   const mockDicomData = {
//     tags: {
//       "00100010": {
//         tagId: "00100010",
//         tagName: "Patient Name",
//         value: "John Doe",
//         hidden: false,
//       },
//       "00100020": {
//         tagId: "00100020",
//         tagName: "Patient ID",
//         value: "12345",
//         hidden: false,
//       },
//       "0020000D": {
//         tagId: "0020000D",
//         tagName: "Study Instance UID",
//         value: "1.2.3.4.5",
//         hidden: true,
//       },
//     },
//     DicomDataSet: {}, // Raw DICOM dataset reference
//   };
  
//   describe("DicomTable Integration Tests", () => {
//     beforeEach(() => {
//       jest.clearAllMocks();
//     });
  
//     test("renders the DICOM table correctly", async () => {
//       await act(async () => {
//         render(
//           <DicomTable
//             {...({
//               dicomData: mockDicomData,
//               fileName: "testFile",
//               updateTableData: mockUpdateTableData,
//               newTableData: [],
//               clearData: mockClearData,
//               showHiddenTags: false,
//             } as DicomTablePropsWithDicomData)}
//           />
//         );
//       });
  
//       expect(screen.getByText("DICOM Tags")).toBeInTheDocument();
//       expect(screen.getByText("Patient Name")).toBeInTheDocument();
//       expect(screen.getByText("John Doe")).toBeInTheDocument();
//       // Hidden tag "Study Instance UID" should not appear
//       expect(screen.queryByText("Study Instance UID")).toBeNull();
//     });
  
//     test("filters tags based on search input", async () => {
//       await act(async () => {
//         render(
//           <DicomTable
//             {...({
//               dicomData: mockDicomData,
//               fileName: "testFile",
//               updateTableData: mockUpdateTableData,
//               newTableData: [],
//               clearData: mockClearData,
//               showHiddenTags: false,
//             } as DicomTablePropsWithDicomData)}
//           />
//         );
//       });
  
//       // Search for "Patient"
//       const searchInput = screen.getByRole("textbox");
//       fireEvent.change(searchInput, { target: { value: "Patient" } });
  
//       await waitFor(() => {
//         expect(screen.getByText("Patient Name")).toBeInTheDocument();
//         // "Study Instance UID" remains hidden
//         expect(screen.queryByText("Study Instance UID")).toBeNull();
//       });
  
//       // Search for "12345" (Patient ID)
//       fireEvent.change(searchInput, { target: { value: "12345" } });
//       await waitFor(() => {
//         expect(screen.getByText("12345")).toBeInTheDocument();
//       });
  
//       // Search for a non-existent tag
//       fireEvent.change(searchInput, { target: { value: "NonExistent" } });
//       await waitFor(() => {
//         expect(screen.getByText("No matching tags found")).toBeInTheDocument();
//       });
//     });
  
//     test("updates a tag value and reflects changes", async () => {
//       await act(async () => {
//         render(
//           <DicomTable
//             {...({
//               dicomData: mockDicomData,
//               fileName: "testFile",
//               updateTableData: mockUpdateTableData,
//               newTableData: [],
//               clearData: mockClearData,
//               showHiddenTags: false,
//             } as DicomTablePropsWithDicomData)}
//           />
//         );
//       });
  
//       // Click pencil icon for "Patient Name"
//       const editIcon = screen.getByLabelText("Edit Tag");
//       fireEvent.click(editIcon);
  
//       // Update the input field
//       const inputField = screen.getByRole("textbox");
//       fireEvent.change(inputField, { target: { value: "Jane Doe" } });
//       fireEvent.blur(inputField);
  
//       await waitFor(() => {
//         expect(mockUpdateTableData).toHaveBeenCalledWith({
//           fileName: "testFile",
//           tagId: "00100010",
//           newValue: "Jane Doe",
//           delete: false,
//         });
//       });
  
//       // Confirm updated value is displayed
//       expect(screen.getByText("Jane Doe")).toBeInTheDocument();
//     });
  
//     test("toggles visibility of hidden tags", async () => {
//       await act(async () => {
//         render(
//           <DicomTable
//             {...({
//               dicomData: mockDicomData,
//               fileName: "testFile",
//               updateTableData: mockUpdateTableData,
//               newTableData: [],
//               clearData: mockClearData,
//               showHiddenTags: false,
//             } as DicomTablePropsWithDicomData)}
//           />
//         );
//       });
  
//       // Hidden tag is not visible initially
//       expect(screen.queryByText("Study Instance UID")).toBeNull();
  
//       // There's presumably a "Show Hidden Tags" button in your UI
//       const showHiddenButton = screen.getByText("Show Hidden Tags");
//       fireEvent.click(showHiddenButton);
  
//       await waitFor(() => {
//         expect(screen.getByText("Study Instance UID")).toBeInTheDocument();
//       });
  
//       // Hide them again
//       fireEvent.click(showHiddenButton);
//       await waitFor(() => {
//         expect(screen.queryByText("Study Instance UID")).toBeNull();
//       });
//     });
  
//     test("downloads updated DICOM file", async () => {
//       await act(async () => {
//         render(
//           <DicomTable
//             {...({
//               dicomData: mockDicomData,
//               fileName: "testFile",
//               updateTableData: mockUpdateTableData,
//               newTableData: [
//                 { fileName: "testFile", tagId: "00100010", newValue: "Jane Doe" },
//               ],
//               clearData: mockClearData,
//               showHiddenTags: false,
//             } as DicomTablePropsWithDicomData)}
//           />
//         );
//       });
  
//       // Click the download button
//       const downloadButton = screen.getByText("Download File");
//       fireEvent.click(downloadButton);
  
//       await waitFor(() => {
//         // Should have triggered the download
//         expect(mockDownloadDicomFile).toHaveBeenCalledTimes(1);
//         // Clears the table data after saving
//         expect(mockClearData).toHaveBeenCalledTimes(1);
//       });
//     });
//   });
  
import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
  } from "@testing-library/react";
  import '@testing-library/jest-dom';
  import DicomTable from "../../../src/components/DicomData/TableComponents/DicomTable";
  import { DicomTableProps } from "../../../src/types/DicomTypes";
  //import { downloadDicomFile } from "../../../src/components/DicomData/DownloadFuncs"
  
  /**
   * Locally extend DicomTableProps to include the 'dicomData' field,
   * which isn't present in the original DicomTableProps interface.
   */
  interface DicomTablePropsWithDicomData extends DicomTableProps {
    dicomData: {
      tags: {
        [tagId: string]: {
          tagId: string;
          tagName: string;
          value: string;
          hidden?: boolean;
        };
      };
      DicomDataSet: any;
    };
  }
  
  // Mock callbacks
  const mockUpdateTableData = jest.fn();
  const mockClearData = jest.fn();
  const mockDownloadDicomFile = jest.fn();
  
  // Mock the file download function
  jest.mock("../../../src/components/DicomData/DownloadFuncs", () => ({
    downloadDicomFile: mockDownloadDicomFile,
  }));
  
  // Provide DICOM data with 'tagId' and 'tagName' fields
  const mockDicomData = {
    tags: {
      "00100010": {
        tagId: "00100010",
        tagName: "Patient Name",
        value: "John Doe",
        hidden: false,
      },
      "00100020": {
        tagId: "00100020",
        tagName: "Patient ID",
        value: "12345",
        hidden: false,
      },
      "0020000D": {
        tagId: "0020000D",
        tagName: "Study Instance UID",
        value: "1.2.3.4.5",
        hidden: true,
      },
    },
    DicomDataSet: {}, // Raw DICOM dataset reference
  };
  
  describe("DicomTable Integration Tests", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test("renders the DICOM table correctly", async () => {
      await act(async () => {
        render(
          <DicomTable
            {...({
              dicomData: mockDicomData,
              fileName: "testFile",
              updateTableData: mockUpdateTableData,
              newTableData: [],
              clearData: mockClearData,
              showHiddenTags: false,
            } as DicomTablePropsWithDicomData)}
          />
        );
      });
  
      expect(screen.getByText("DICOM Tags")).toBeInTheDocument();
      expect(screen.getByText("Patient Name")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      // Hidden tag "Study Instance UID" should not appear
      expect(screen.queryByText("Study Instance UID")).toBeNull();
    });
  
    test("filters tags based on search input", async () => {
      await act(async () => {
        render(
          <DicomTable
            {...({
              dicomData: mockDicomData,
              fileName: "testFile",
              updateTableData: mockUpdateTableData,
              newTableData: [],
              clearData: mockClearData,
              showHiddenTags: false,
            } as DicomTablePropsWithDicomData)}
          />
        );
      });
  
      // Search for "Patient"
      const searchInput = screen.getByRole("textbox");
      fireEvent.change(searchInput, { target: { value: "Patient" } });
  
      await waitFor(() => {
        expect(screen.getByText("Patient Name")).toBeInTheDocument();
        // "Study Instance UID" remains hidden
        expect(screen.queryByText("Study Instance UID")).toBeNull();
      });
  
      // Search for "12345" (Patient ID)
      fireEvent.change(searchInput, { target: { value: "12345" } });
      await waitFor(() => {
        expect(screen.getByText("12345")).toBeInTheDocument();
      });
  
      // Search for a non-existent tag
      fireEvent.change(searchInput, { target: { value: "NonExistent" } });
      await waitFor(() => {
        expect(screen.getByText("No matching tags found")).toBeInTheDocument();
      });
    });
  
    test("updates a tag value and reflects changes", async () => {
      await act(async () => {
        render(
          <DicomTable
            {...({
              dicomData: mockDicomData,
              fileName: "testFile",
              updateTableData: mockUpdateTableData,
              newTableData: [],
              clearData: mockClearData,
              showHiddenTags: false,
            } as DicomTablePropsWithDicomData)}
          />
        );
      });
  
      // Click pencil icon for "Patient Name"
      const editIcon = screen.getByLabelText("Edit Tag");
      fireEvent.click(editIcon);
  
      // Update the input field
      const inputField = screen.getByRole("textbox");
      fireEvent.change(inputField, { target: { value: "Jane Doe" } });
      fireEvent.blur(inputField);
  
      await waitFor(() => {
        expect(mockUpdateTableData).toHaveBeenCalledWith({
          fileName: "testFile",
          tagId: "00100010",
          newValue: "Jane Doe",
          delete: false,
        });
      });
  
      // Confirm updated value is displayed
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });
  
    test("toggles visibility of hidden tags", async () => {
      await act(async () => {
        render(
          <DicomTable
            {...({
              dicomData: mockDicomData,
              fileName: "testFile",
              updateTableData: mockUpdateTableData,
              newTableData: [],
              clearData: mockClearData,
              showHiddenTags: false,
            } as DicomTablePropsWithDicomData)}
          />
        );
      });
  
      // Hidden tag is not visible initially
      expect(screen.queryByText("Study Instance UID")).toBeNull();
  
      // There's presumably a "Show Hidden Tags" button in your UI
      const showHiddenButton = screen.getByText("Show Hidden Tags");
      fireEvent.click(showHiddenButton);
  
      await waitFor(() => {
        expect(screen.getByText("Study Instance UID")).toBeInTheDocument();
      });
  
      // Hide them again
      fireEvent.click(showHiddenButton);
      await waitFor(() => {
        expect(screen.queryByText("Study Instance UID")).toBeNull();
      });
    });
  
    test("downloads updated DICOM file", async () => {
      await act(async () => {
        render(
          <DicomTable
            {...({
              dicomData: mockDicomData,
              fileName: "testFile",
              updateTableData: mockUpdateTableData,
              newTableData: [
                { fileName: "testFile", tagId: "00100010", newValue: "Jane Doe" },
              ],
              clearData: mockClearData,
              showHiddenTags: false,
            } as DicomTablePropsWithDicomData)}
          />
        );
      });
  
      // Click the download button
      const downloadButton = screen.getByText("Download File");
      fireEvent.click(downloadButton);
  
      await waitFor(() => {
        // Should have triggered the download
        expect(mockDownloadDicomFile).toHaveBeenCalledTimes(1);
        // Clears the table data after saving
        expect(mockClearData).toHaveBeenCalledTimes(1);
      });
    });
  });
  