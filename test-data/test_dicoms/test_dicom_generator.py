import pydicom
import numpy as np
from pydicom.dataset import FileDataset
from pydicom.uid import generate_uid
import datetime
import os
import argparse


# TODO: refactor this to use createdicom() function
def create_dicom_files():
    '''
    This function creates a number of DICOM files.
    '''
    for i in range(args.number):

        folder = "./gen_dicom_files/simple_files/"
        if not os.path.exists(folder):
            os.makedirs(folder)
        # Define the DICOM file name
        dicom_filename = "test_dicom_" + str(i) + ".dcm"

        # Create a new empty DICOM dataset
        ds = FileDataset(dicom_filename, {}, file_meta=pydicom.dataset.FileMetaDataset(), preamble=b"\0" * 128)

        # Set file meta information (Mandatory for DICOM files)
        ds.file_meta.MediaStorageSOPClassUID = pydicom.uid.ComputedRadiographyImageStorage
        ds.file_meta.MediaStorageSOPInstanceUID = generate_uid()
        ds.file_meta.TransferSyntaxUID = pydicom.uid.ExplicitVRLittleEndian

        # Set required DICOM metadata
        ds.PatientName = "John Doe " + str(i)
        ds.PatientID = str(i)
        ds.Modality = "CT"
        ds.StudyDate = datetime.datetime.now().strftime("%Y%m%d")
        ds.SeriesInstanceUID = generate_uid()
        ds.StudyInstanceUID = generate_uid()
        ds.SOPInstanceUID = generate_uid()
        ds.SOPClassUID = pydicom.uid.ComputedRadiographyImageStorage

        if(args.maxanonymize):
            # Set optional DICOM metadata
            ds.AccessionNumber = "NOT ANONYMOUS"
            ds.InstitutionName = "NOT ANONYMOUS"
            ds.InstitutionAddress = "NOT ANONYMOUS"
            ds.ReferringPhysicianName = "NOT ANONYMOUS"
            ds.ReferringPhysiciansAddress = "NOT ANONYMOUS"
            ds.ReferringPhysiciansTelephoneNumbers = "NOT ANONYMOUS"
            ds.ConsultingPhysiciansName = "NOT ANONYMOUS"
            ds.PerformingPhysicianName = "NOT ANONYMOUS"
            ds.NameOfPhysiciansReadingStudy = "NOT ANONYMOUS"
            ds.OperatorsName = "NOT ANONYMOUS"
            ds.PatientName = "NOT ANONYMOUS"
            ds.PatientID = "NOT ANONYMOUS"
            ds.PatientBirthDate = "NOT ANONYMOUS"
            ds.PatientsBirthDateInAlternativeCalendar = "NOT ANONYMOUS"
            ds.PatientsDeathDateInAlternativeCalendar = "NOT ANONYMOUS"
            ds.AdditionalPatientHistory = "NOT ANONYMOUS"
            ds.PatientsTelephoneNumbers = "NOT ANONYMOUS"
            ds.OtherPatientIDs = "NOT ANONYMOUS"
            ds.OtherPatientNames = "NOT ANONYMOUS"
            ds.PatientsBirthName = "NOT ANONYMOUS"
            ds.PatientsAddress = "NOT ANONYMOUS"
            ds.PatientsMothersBirthName = "NOT ANONYMOUS"
            ds.ClinicalTrialSponsorName = "NOT ANONYMOUS"
            ds.ClinicalTrialSiteName = "NOT ANONYMOUS"
            ds.ClinicalTrialCoordinatingCenterName = "NOT ANONYMOUS"
            ds.ClinicalTrialProtocolEthicsCommitteeName = "NOT ANONYMOUS"
            ds.ClinicalTrialProtocolEthicsCommitteeApprovalNumber = "NOT ANONYMOUS"
            ds.SecondaryReviewerName = "NOT ANONYMOUS"
            ds.EvaluatorName = "NOT ANONYMOUS"
            ds.ScheduledPerformingPhysiciansName = "NOT ANONYMOUS"
            ds.NamesOfIntendedRecipientsofResults = "NOT ANONYMOUS"
            ds.PersonsTelephoneNumbers = "NOT ANONYMOUS"
            ds.OrderCallbackPhoneNumber = "NOT ANONYMOUS"
            ds.ContentCreatorsName = "NOT ANONYMOUS"

        # Save the DICOM file
        ds.save_as(folder + dicom_filename)

        print(f"DICOM file {dicom_filename} has been created successfully!")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
                    prog='gen test dicoms',
                    description='generate test dicom files',
                    epilog='Test dicom files generator')
    parser.add_argument('-n', '--number', type=int, help='number of dicom files to generate', default=100)
    parser.add_argument('-a', '--maxanonymize', action='store_true', help='include all tags to anonymize in dicom files', default=False)
    args = parser.parse_args()

    create_dicom_files()
    #createdicom("dicom_test_new1", generate_uid(), "John Doe", "1", "CT", datetime.datetime.now().strftime("%Y%m%d"), generate_uid(), generate_uid(), generate_uid())
