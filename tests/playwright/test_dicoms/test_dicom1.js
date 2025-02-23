import { DicomMetaDictionary, DicomMessage } from 'dcmjs';
import { writeFileSync } from 'node:fs';

const dataset = {
  // Patient/Study/Series
  PatientName: "Test^Patient",
  PatientID: "12345",
  StudyInstanceUID: DicomMetaDictionary.uid(),
  SeriesInstanceUID: DicomMetaDictionary.uid(),
  SOPInstanceUID: DicomMetaDictionary.uid(),

  // Required DICOM Tags
  SOPClassUID: '1.2.840.10008.5.1.4.1.1.2', // CT Image Storage
  Modality: 'CT',
  TransferSyntaxUID: '1.2.840.10008.1.2', // Implicit Little Endian

  // Image Parameters
  Rows: 128,
  Columns: 128,
  BitsAllocated: 16,
  BitsStored: 16,
  HighBit: 15,
  PixelRepresentation: 0,
  PhotometricInterpretation: "MONOCHROME2",
  SamplesPerPixel: 1,
  PixelData: new Uint16Array(128 * 128).buffer,
};

const naturalized = DicomMetaDictionary.naturalizeDataset(dataset);
const buffer = DicomMessage.writeFile(naturalized);
writeFileSync('test_dicom1.dcm', Buffer.from(buffer)); // Save the file