import React from "react";
import { Modal } from "./Modal";

interface DownloadWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DownloadWarningModal: React.FC<DownloadWarningModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="No Edits Detected"
      text="You haven't made any changes to this file. Please edit at least one tag before downloading."
    />
  );
};

export default DownloadWarningModal;

