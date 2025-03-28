import { useQuestionModalStore } from "@state/QuestionModalStore";

/**
 * QuestionModal component for displaying a question modal dialog
 * @component
 * @precondition QuestionModal component is initialized and registered in the app
 * @postcondition QuestionModal renders when activated via the store and executes
 *               the provided callbacks when user makes a selection
 * @returns QuestionModal component
 */
export function QuestionModal() {
    const { isOpen, title, text, onConfirm, onCancel, closeModal } =
        useQuestionModalStore();

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
            style={{ isolation: "isolate" }}
        >
            <div
                className="w-full max-w-sm rounded bg-white p-6 text-black shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h4 className="text-xl font-semibold">{title}</h4>
                <p className="my-4">{text}</p>
                <div className="flex justify-between">
                    <button
                        id="yes"
                        onClick={() => {
                            onConfirm();
                            closeModal();
                        }}
                        className="rounded bg-success px-4 py-2 text-info-content hover:bg-green-400 disabled:bg-base-300"
                    >
                        Yes
                    </button>
                    <button
                        id="no"
                        onClick={() => {
                            onCancel();
                            closeModal();
                        }}
                        className="rounded bg-error px-4 py-2 text-info-content hover:bg-red-400 disabled:bg-base-300"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}
