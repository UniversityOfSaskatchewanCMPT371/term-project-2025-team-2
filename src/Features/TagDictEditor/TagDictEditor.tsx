import { standardDataElements } from "@dataFunctions/TagDictionary/standardDataElements";
import { GenButton } from "@components/utils/GenButton";
import { PencilSquareIcon, XCircleIcon } from "@heroicons/react/24/outline";

export const TagDictEditor = () => {

    return (
        <dialog id="tagEdit_modal" className="modal modal-bottom">
            <div className="modal-box w-full">
                <h3 className="text-2xl font-bold">Tag Dictionary</h3>
                <div className="py-4 text-lg font-semibold">
                    Tag Dictionary Editor
                </div>
                <table className="table-auto w-full">
                    <thead className="border">
                        <tr>
                            <th className="border">Tag ID</th>
                            <th className="border">Tag Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(standardDataElements).map((key, index) => (
                            <tr key={index}>
                                <td className="border text-center">{key}</td>
                                <td className="border">
                                    <div className="flex justify-between">
                                        {standardDataElements[key].name}
                                        <div className="flex flex-col-2">
                                            <div className="flex cursor-pointer justify-end hover:text-accent">
                                                <PencilSquareIcon className="h-6 w-6" />
                                            </div>
                                            <div className="flex cursor-pointer justify-end hover:text-accent">
                                                <XCircleIcon className="ml-4 h-6 w-6" />
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="modal-action">
                <form method="dialog">
                    <GenButton
                        onClick={() => {
                            const tagEditModal =
                                document.getElementById("tagEdit_modal");
                            if (tagEditModal) {
                                (tagEditModal as HTMLDialogElement).close();
                            }
                        }}
                        disabled={false}
                        label="Close"
                    />
                </form>
            </div>
        </dialog>
    );
};

