import React from 'react';

interface AnonPopupProps {
    tags: { tagId: string, newValue: string }[];
    onConfirm: () => void;
    onCancel: () => void;
}

const AnonPopup: React.FC<AnonPopupProps> = ({ tags, onConfirm, onCancel }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-5 rounded-lg text-center shadow-lg max-w-lg w-11/12">
                <h2 className="mb-5 text-xl">Tags to be Anonymized</h2>
                <ul className="list-none p-0 mb-5">
                    {tags.map((tag, index) => (
                        <li key={index} className="mb-2 text-lg">
                            <strong>{tag.tagId}</strong>: {tag.newValue}
                        </li>
                    ))}
                </ul>
                <div className="flex justify-around">
                    <button className="btn btn-primary" onClick={onConfirm}>OK</button>
                    <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AnonPopup;