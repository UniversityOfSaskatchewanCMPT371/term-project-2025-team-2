import React from 'react';
import { AnonPopupProps } from '../../../types/DicomTypes';

/**
 * Confirmation popup for auto anonymized tags
 * @param {AnonPopupProps} props - Component props
 * @returns {JSX.Element} Popup box with list of tags to be anonymized
 */
export const AnonPopup: React.FC<AnonPopupProps> = ({ tags, onConfirm, onCancel }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-5 rounded-lg text-center shadow-lg max-w-lg w-11/12 max-h-full overflow-y-auto">
                <h2 className="mb-5 text-xl text-blue-400 font-bold">Tags to be Anonymized</h2>
                <ul className="list-none p-0 mb-5">
                    {tags.map((tag, index) => (
                        <li key={index} className="mb-2 text-lg text-gray-500">
                            <strong>{tag.tagId} ({tag.tagName})</strong>: {tag.newValue}
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
