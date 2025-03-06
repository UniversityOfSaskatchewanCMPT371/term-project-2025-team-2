import { QuestionModalProps } from "../../../types/types";

/**
 *
 * @param QuestionModalProps - props for QuestionModal component
 * @returns QuestionModal component
 */
function QuestionModal({
    setSeries,
    setIsOpen,
    title,
    text,
}: QuestionModalProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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
                            setSeries(true);
                            setIsOpen(false);
                        }}
                        disabled={false}
                        className="rounded bg-success px-4 py-2 text-info-content hover:bg-green-400 disabled:bg-base-300"
                    >
                        Yes
                    </button>
                    <button
                        id="no"
                        onClick={() => {
                            setSeries(false);
                            setIsOpen(false);
                        }}
                        disabled={false}
                        className="rounded bg-error px-4 py-2 text-info-content hover:bg-red-400 disabled:bg-base-300"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuestionModal;
