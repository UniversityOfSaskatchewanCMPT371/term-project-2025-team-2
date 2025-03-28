import { create } from "zustand";
import { QuestionModalState } from "../types/types";

/**
 * QuestionModalStore for managing the state of the question modal
 * @module
 * @returns {QuestionModalState} QuestionModalStore state
 */
export const useQuestionModalStore = create<QuestionModalState>((set) => ({
    isOpen: false,
    title: "",
    text: "",
    onConfirm: () => {},
    onCancel: () => {},

    openModal: ({ title, text, onConfirm, onCancel = () => {} }) =>
        set({ isOpen: true, title, text, onConfirm, onCancel }),

    closeModal: () => set({ isOpen: false }),
}));
