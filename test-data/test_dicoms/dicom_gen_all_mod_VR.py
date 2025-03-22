import pydicom
from pydicom.dataset import FileDataset, Dataset
from pydicom.uid import generate_uid
import datetime
import os

modalities = ["CT", "MR", "CR", "US"]

# Output folder structure
folder = "./test-data/test_dicoms/gen_dicom_files/all_mod_fullVR/"

# VRs to populate (same as test file)
vr_tag_map = {
    "FD": (0x0019, 0x1000),
    "FL": (0x0019, 0x1001),
    "UL": (0x0019, 0x1002),
    "US": (0x0019, 0x1003),
    "SL": (0x0019, 0x1004),
    "SS": (0x0019, 0x1005),
    "IS": (0x0019, 0x1006),
    "DS": (0x0019, 0x1007),
    "LO": (0x0019, 0x1008),
    "SH": (0x0019, 0x1009),
    "ST": (0x0019, 0x100A),
    "LT": (0x0019, 0x100B),
    "PN": (0x0019, 0x100C),
    "CS": (0x0019, 0x100D),
    "UT": (0x0019, 0x100E),
    "UC": (0x0019, 0x100F),
    "DA": (0x0019, 0x1010),
    "TM": (0x0019, 0x1011),
    "DT": (0x0019, 0x1012),
    "UI": (0x0019, 0x1013),
    "SQ": (0x0019, 0x1014),
    "OB": (0x0019, 0x1015),
    "OW": (0x0019, 0x1016),
    "UN": (0x0019, 0x1017),
}

def create_dicom_for_modality(modality):
    filename = f"{modality}_test_dicom_0.dcm"
    filepath = os.path.join(folder, modality)
    if not os.path.exists(filepath):
        os.makedirs(filepath)

    ds = FileDataset(filename, {}, file_meta=pydicom.dataset.FileMetaDataset(), preamble=b"\0" * 128)

    # Standard DICOM metadata
    ds.file_meta.MediaStorageSOPClassUID = pydicom.uid.SecondaryCaptureImageStorage
    ds.file_meta.MediaStorageSOPInstanceUID = generate_uid()
    ds.file_meta.TransferSyntaxUID = pydicom.uid.ExplicitVRLittleEndian

    ds.PatientName = "John^Doe"
    ds.PatientID = "TEST123"
    ds.Modality = modality
    ds.StudyDate = datetime.datetime.now().strftime("%Y%m%d")
    ds.SeriesInstanceUID = generate_uid()
    ds.StudyInstanceUID = generate_uid()
    ds.SOPInstanceUID = generate_uid()
    ds.SOPClassUID = pydicom.uid.SecondaryCaptureImageStorage

    # Populate tags for all VR types
    ds.add_new(vr_tag_map["FD"], "FD", 1234.5678)
    ds.add_new(vr_tag_map["FL"], "FL", 12.34)
    ds.add_new(vr_tag_map["UL"], "UL", 400000)
    ds.add_new(vr_tag_map["US"], "US", 500)
    ds.add_new(vr_tag_map["SL"], "SL", -2000)
    ds.add_new(vr_tag_map["SS"], "SS", -300)
    ds.add_new(vr_tag_map["IS"], "IS", "42")
    ds.add_new(vr_tag_map["DS"], "DS", "56.78")
    ds.add_new(vr_tag_map["LO"], "LO", "Test Long String")
    ds.add_new(vr_tag_map["SH"], "SH", "Shrt")
    ds.add_new(vr_tag_map["ST"], "ST", "Short Text Example")
    ds.add_new(vr_tag_map["LT"], "LT", "This is a long text example.")
    ds.add_new(vr_tag_map["PN"], "PN", "DOE^JOHN")
    ds.add_new(vr_tag_map["CS"], "CS", "CODE")
    ds.add_new(vr_tag_map["UT"], "UT", "This is unlimited text")
    ds.add_new(vr_tag_map["UC"], "UC", "UnlimitedCharacters")
    ds.add_new(vr_tag_map["DA"], "DA", "20250319")
    ds.add_new(vr_tag_map["TM"], "TM", "153045")
    ds.add_new(vr_tag_map["DT"], "DT", "20250319153045")
    ds.add_new(vr_tag_map["UI"], "UI", generate_uid())

    # Binary and Sequence VRs (mocked content)
    seq = Dataset()
    seq.PatientName = "SEQ^NAME"
    ds.add_new(vr_tag_map["SQ"], "SQ", [seq])

    ds.add_new(vr_tag_map["OB"], "OB", b'\x01\x02\x03\x04')
    ds.add_new(vr_tag_map["OW"], "OW", b'\x00\x01\x00\x02\x00\x03')
    ds.add_new(vr_tag_map["UN"], "UN", b'UNKNOWN')

    ds.save_as(os.path.join(filepath, filename))
    print(f"[{modality}] DICOM file saved at {os.path.join(filepath, filename)}")

def main():
    for modality in modalities:
        create_dicom_for_modality(modality)

if __name__ == "__main__":
    main()
