import { useState } from "react";
import { Search } from "../../utils/Search";
import { GenButton } from "../../utils/GenButton";
import { AnonTag, TableControlsProps } from "../../../types/DicomTypes";
import { AutoAnon, FormatData } from "../../Auto/AutoClean";
import { useStore } from "../../State/Store";
import { AnonPopup } from "./AnonPopup";
import { TagDictionary } from "../../../tagDictionary/dictionary";
import { updateAllFiles } from "../../DicomData/UpdateAllFiles";
import { tagUpdater } from "../../DicomData/TagUpdater";
import { createFile, downloadDicomFile } from "../../DicomData/DownloadFuncs";
import DownloadWarningModal from "../../utils/Modals/DownloadWarningModal";
import NoEditsModal from "../../utils/Modals/NoEditsModal";

/**
 * Controls component for the DICOM table
 * @component
 * @param {Object} props - The component props
 * @param {string} props.searchTerm - Current search term
 * @param {function(string): void} props.onSearchChange - Callback for search term changes
 * @param {function(): void} props.onSave - Callback for save action
 * @param {function(): void} props.onToggleHidden - Callback for toggling hidden tags
 * @param {boolean} props.showHidden - Whether hidden tags are currently shown
 * @precondition dicomData and files should not be empty
 * @returns {JSX.Element} The rendered controls section
 */
export const TableControls: React.FC<TableControlsProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  const dicomData = useStore((state) => state.dicomData);
  const files = useStore((state) => state.files);
  const anonTags = useStore((state) => state.tags);
  const setTags = useStore((state) => state.setTags);
  const clearData = useStore((state) => state.clearData);
  const showPopup = useStore((state) => state.showPopup);
  const setShowPopup = useStore((state) => state.setShowPopup);
  const currentFileIndex = useStore((state) => state.currentFileIndex);
  const newTagValues = useStore((state) => state.newTagValues);
  const downloadOption = useStore((state) => state.downloadOption);
  const series = useStore((state) => state.series);

  const tagDictionary = new TagDictionary();

  const [showDownloadWarningModal, setShowDownloadWarningModal] = useState(false);
  const [showNoEditsModal, setShowNoEditsModal] = useState(false);

  const handleAutoAnon = async () => {
    const newTagData: AnonTag[] = FormatData(dicomData[0]).map(
      (tag: { tagId: string; tagName: string; newValue: string }) => ({
        tagId: tag.tagId,
        tagName: tagDictionary.lookupTagName(tag.tagId),
        newValue: tag.newValue,
      })
    );
    setTags(newTagData);
    setShowPopup(true);
  };

  const handleUpdateTag = (tagId: string, newValue: string) => {
    const updatedTags = anonTags.map((tag: AnonTag) =>
      tag.tagId === tagId ? { ...tag, newValue } : tag
    );
    setTags(updatedTags);
  };

  const handleConfirm = async () => {
    await AutoAnon(dicomData, files, anonTags);
    setShowPopup(false);
    clearData();
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  const handleDownloadSingleFile = () => {
    const currentFileName = files[currentFileIndex]?.name;
    const isFileEdited = newTagValues.some(
      (tag) => tag.fileName === currentFileName
    );

    if (!isFileEdited) {
      setShowDownloadWarningModal(true);
      return;
    }

    const updatedDicomData = tagUpdater(
      dicomData[currentFileIndex].DicomDataSet,
      newTagValues
    );
    const blob = new Blob([updatedDicomData], {
      type: "application/dicom",
    });
    const newFile = createFile(currentFileName, blob);
    downloadDicomFile(newFile);
    clearData();
  };

  const handleDownloadZip = async () => {
    const hadEdits = await updateAllFiles(
      dicomData,
      series,
      newTagValues,
      files,
      currentFileIndex,
      downloadOption,
      setShowNoEditsModal
    );

    if (hadEdits) {
      clearData();
    }
  };

  return (
    <div className="flex-col-2 flex">
      <Search searchTerm={searchTerm} onSearchChange={onSearchChange} />
      <div className="flex-col-2 ml-4 flex">
        <div>
          <GenButton
            label="Download File"
            disabled={false}
            onClick={handleDownloadSingleFile}
          />
        </div>

        <div className="ml-4">
          <GenButton
            onClick={handleAutoAnon}
            label="Auto Anon"
            disabled={false}
          />
        </div>

        <div className="ml-4">
          <GenButton
            label="Download All as Zip"
            disabled={false}
            onClick={handleDownloadZip}
          />
        </div>
      </div>

      {showPopup && (
        <AnonPopup
          tags={anonTags}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onUpdateTag={handleUpdateTag}
        />
      )}

      <DownloadWarningModal
        isOpen={showDownloadWarningModal}
        onClose={() => setShowDownloadWarningModal(false)}
      />

      <NoEditsModal
        isOpen={showNoEditsModal}
        onClose={() => setShowNoEditsModal(false)}
      />

    </div>
  );
};
