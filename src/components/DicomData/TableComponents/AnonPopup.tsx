import React from 'react';
import './TagPopup.css';

interface TagPopupProps {
    tags: { tagId: string, newValue: string }[];
    onConfirm: () => void;
    onCancel: () => void;
}

const TagPopup: React.FC<TagPopupProps> = ({ tags, onConfirm, onCancel }) => {
    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Tags to be Anonymized</h2>
                <ul>
                    {tags.map((tag, index) => (
                        <li key={index}>
                            {tag.tagId}: {tag.newValue}
                        </li>
                    ))}
                </ul>
                <button onClick={onConfirm}>OK</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default TagPopup;