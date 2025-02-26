import pydicom
import numpy as np
from pydicom.dataset import FileDataset
from pydicom.uid import generate_uid
import datetime

# Define the DICOM file name
dicom_filename = "./test-data/test_dicoms/test_dicom1.dcm"

# Create a new empty DICOM dataset
ds = FileDataset(dicom_filename, {}, file_meta=pydicom.dataset.FileMetaDataset(), preamble=b"\0" * 128)

# Set file meta information (Mandatory for DICOM files)
ds.file_meta.MediaStorageSOPClassUID = pydicom.uid.ImplicitVRLittleEndian
ds.file_meta.MediaStorageSOPInstanceUID = generate_uid()
ds.file_meta.TransferSyntaxUID = pydicom.uid.ImplicitVRLittleEndian

# Set required DICOM metadata
ds.PatientName = "John Doe"
ds.PatientID = "123456"
ds.Modality = "CT"
ds.StudyDate = datetime.datetime.now().strftime("%Y%m%d")
ds.SeriesInstanceUID = generate_uid()
ds.StudyInstanceUID = generate_uid()
ds.SOPInstanceUID = generate_uid()
ds.SOPClassUID = pydicom.uid.SecondaryCaptureImageStorage

# Save the DICOM file
ds.save_as(dicom_filename)

print(f"DICOM file '{dicom_filename}' has been created successfully!")
