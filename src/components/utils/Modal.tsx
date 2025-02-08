import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string; // Accept title as a prop
    text: string;  // Accept text as a prop
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, text }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded shadow-lg text-black max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h4 className="text-xl font-semibold">{title}</h4> 
                <p className="mt-4">{text}</p>
                <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;
