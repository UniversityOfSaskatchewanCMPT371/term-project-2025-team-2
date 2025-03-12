import React from "react";
import { Modal } from "./Modal";

interface NoEditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NoEditsModal: React.FC<NoEditsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="No Edits Found"
      text="None of the uploaded files have been edited. Please make changes before downloading."
    />
  );
};

export default NoEditsModal;

