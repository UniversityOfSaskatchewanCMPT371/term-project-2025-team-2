import pydicom
import numpy as np
from pydicom.dataset import FileDataset
from pydicom.uid import generate_uid
import datetime
import os
import argparse


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

def createdicom(newfilename, mediaSOPInstUID, pname, ptid, mod, studydate, seriesUID, studyUID, SOPInstUID, hasName, hasID):
    # Create a new empty DICOM dataset
    dicom_filename = newfilename + ".dcm"
    ds = FileDataset(dicom_filename, {}, file_meta=pydicom.dataset.FileMetaDataset(), preamble=b"\0" * 128)

    # Set file meta information (Mandatory for DICOM files)
    ds.file_meta.MediaStorageSOPClassUID = pydicom.uid.ComputedRadiographyImageStorage
    ds.file_meta.MediaStorageSOPInstanceUID = mediaSOPInstUID
    ds.file_meta.TransferSyntaxUID = pydicom.uid.ExplicitVRLittleEndian

    # Set required DICOM metadata
    if hasName:
        ds.PatientName = pname
    if hasID:
        ds.PatientID = ptid
    ds.Modality = mod
    ds.StudyDate = studydate
    ds.SeriesInstanceUID = seriesUID
    ds.StudyInstanceUID = studyUID
    ds.SOPInstanceUID = SOPInstUID
    ds.SOPClassUID = pydicom.uid.ComputedRadiographyImageStorage

    # Save the DICOM file
    createCustomDicom(ds, dicom_filename)

def createDicomAllVRs(newfilename, mediaSOPInstUID, pname, ptid, mod, studydate, seriesUID, studyUID, SOPInstUID,
                      trange, numReferences, energyWindowNum, examinedBodyThickness, pixelCoordinatesSetTrial, tidOffset):
       # Create a new empty DICOM dataset
    dicom_filename = newfilename + ".dcm"
    ds = FileDataset(dicom_filename, {}, file_meta=pydicom.dataset.FileMetaDataset(), preamble=b"\0" * 128)

    # Set file meta information (Mandatory for DICOM files)
    ds.file_meta.MediaStorageSOPClassUID = pydicom.uid.ComputedRadiographyImageStorage
    ds.file_meta.MediaStorageSOPInstanceUID = mediaSOPInstUID
    ds.file_meta.TransferSyntaxUID = pydicom.uid.ExplicitVRLittleEndian

    # Set required DICOM metadata
    ds.PatientName = pname
    ds.PatientID = ptid
    ds.Modality = mod
    ds.StudyDate = studydate
    ds.SeriesInstanceUID = seriesUID
    ds.StudyInstanceUID = studyUID
    ds.SOPInstanceUID = SOPInstUID
    ds.SOPClassUID = pydicom.uid.ComputedRadiographyImageStorage

    # Tag values with other VRs
    ds.TimeRange = trange                                   # FD
    ds.NumberOfReferences = numReferences                   # UL
    ds.EnergyWindowNumber = energyWindowNum                 # US
    ds.ExaminedBodyThickness = examinedBodyThickness        # FL
    ds.PixelCoordinatesSetTrial = pixelCoordinatesSetTrial  # SL
    ds.TIDOffset = tidOffset                                # SS

    # Save the DICOM file
    createCustomDicom(ds, dicom_filename)

def createCustomDicom(fileDataSet, newfilename):
    folder = "./test-data/test_dicoms/gen_dicom_files/tagUpdater_testing/"
    if not os.path.exists(folder):
        os.makedirs(folder)
    fileDataSet.save_as(folder + newfilename)
    print(f"DICOM file {newfilename} has been created successfully!")


def createTagUpdaterTestFiles():
     # Create a new DICOM file
    mediaSOPInstUID = generate_uid()
    patientname = "John Doe"
    ptID = "0"
    mod = "CT"
    studyDate = datetime.datetime.now().strftime("%Y%m%d")
    seriesUID = generate_uid()
    studyUID = generate_uid()
    SOPInstUID = generate_uid()
    filename = 'test_dicom_tagUpdtest'
    createdicom(filename, mediaSOPInstUID, patientname, ptID, mod, studyDate, seriesUID, studyUID, SOPInstUID, True, True)
    
    # Creating a variation of the same file
    filename = "test_dicom_0_editName"
    patientname = "ANONYMOUS"
    createdicom(filename, mediaSOPInstUID, patientname, ptID, mod, studyDate, seriesUID, studyUID, SOPInstUID, True, True)
    filename = "test_dicom_0_editNameID"
    ptID = "1010"
    createdicom(filename, mediaSOPInstUID, patientname, ptID, mod, studyDate, seriesUID, studyUID, SOPInstUID, True, True)
    
    # Create dicoms without patient name or id
    filename = "test_dicom_0_noName"
    ptID = "0"
    createdicom(filename, mediaSOPInstUID, patientname, ptID, mod, studyDate, seriesUID, studyUID, SOPInstUID, False, True)
    filename = "test_dicom_0_NameNoID"
    patientname = "ANONYMOUS"
    createdicom(filename, mediaSOPInstUID, patientname, ptID, mod, studyDate, seriesUID, studyUID, SOPInstUID, True, False)

def createTagUpdaterAllVRsTestFiles():
    mediaSOPInstUID = generate_uid()
    patientname = "John Doe"
    ptID = "0"
    mod = "CT"
    studyDate = datetime.datetime.now().strftime("%Y%m%d")
    seriesUID = generate_uid()
    studyUID = generate_uid()
    SOPInstUID = generate_uid()
    trange = 86231.111079                           # FD
    numReferences = 750675506                       # UL
    energyWindowNum = 400                           # US
    examinedBodyThickness = 10.60060977935791       # FL
    pixelCoordinatesSetTrial = 912                  # SL
    tidOffset = 0                                   # SS
    filename = 'test_dicom_AllVRs'
    createDicomAllVRs(filename, mediaSOPInstUID, patientname, ptID, mod, studyDate, seriesUID, studyUID, SOPInstUID,
                      trange, numReferences, energyWindowNum, examinedBodyThickness, pixelCoordinatesSetTrial, tidOffset)
    filename = 'test_dicom_AllVRs_changeFD'
    createDicomAllVRs(filename, mediaSOPInstUID, patientname, ptID, mod, studyDate, seriesUID, studyUID, SOPInstUID,
                      trange + 1.0, numReferences, energyWindowNum, examinedBodyThickness, pixelCoordinatesSetTrial, tidOffset)
    filename = 'test_dicom_AllVRs_changeUL'
    createDicomAllVRs(filename, mediaSOPInstUID, patientname, ptID, mod, studyDate, seriesUID, studyUID, SOPInstUID,
                      trange, numReferences+3, energyWindowNum, examinedBodyThickness, pixelCoordinatesSetTrial, tidOffset)
    filename = 'test_dicom_AllVRs_changeUS'
    createDicomAllVRs(filename, mediaSOPInstUID, patientname, ptID, mod, studyDate, seriesUID, studyUID, SOPInstUID,
                      trange, numReferences, energyWindowNum-100, examinedBodyThickness, pixelCoordinatesSetTrial, tidOffset)
    filename = 'test_dicom_AllVRs_changeFL'
    createDicomAllVRs(filename, mediaSOPInstUID, patientname, ptID, mod, studyDate, seriesUID, studyUID, SOPInstUID,
                      trange, numReferences, energyWindowNum, examinedBodyThickness-5, pixelCoordinatesSetTrial, tidOffset)
    filename = 'test_dicom_AllVRs_changeSL'
    createDicomAllVRs(filename, mediaSOPInstUID, patientname, ptID, mod, studyDate, seriesUID, studyUID, SOPInstUID,
                      trange, numReferences, energyWindowNum, examinedBodyThickness, pixelCoordinatesSetTrial-100, tidOffset)
    filename = 'test_dicom_AllVRs_changeSS'
    createDicomAllVRs(filename, mediaSOPInstUID, patientname, ptID, mod, studyDate, seriesUID, studyUID, SOPInstUID,
                      trange, numReferences, energyWindowNum, examinedBodyThickness, pixelCoordinatesSetTrial, tidOffset+2)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
                    prog='gen test dicoms',
                    description='generate test dicom files',
                    epilog='Test dicom files generator')
    parser.add_argument('-n', '--number', type=int, help='number of dicom files to generate', default=100)
    parser.add_argument('-a', '--maxanonymize', action='store_true', help='include all tags to anonymize in dicom files', default=False)
    args = parser.parse_args()

    create_dicom_files()

    ### For tagUpdater() tests ###
    # createTagUpdaterTestFiles()
    # createTagUpdaterAllVRsTestFiles()