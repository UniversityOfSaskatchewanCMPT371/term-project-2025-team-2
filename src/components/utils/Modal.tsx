import React from "react";
import { GenButton } from "../Navigation/Button.tsx";

/**
 * interface ModalProps
 * @param isOpen - Boolean to determine if modal is open
 * @param onClose - Function to handle modal close
 * @param title - Modal title
 * @param text - Modal text
 */
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    text: string;
}

/**
 *
 * @param isOpen - Boolean to determine if modal is open
 * @param onClose - Function to handle modal close
 * @param title - Modal title
 * @param text - Modal text
 * @returns rendered Modal component
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, text }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm rounded bg-white p-6 text-black shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h4 className="text-xl font-semibold">{title}</h4>
                <p className="my-4">{text}</p>
                <GenButton onClick={onClose} disabled={false} label="Close" />
            </div>
        </div>
    );
};

export default Modal;
