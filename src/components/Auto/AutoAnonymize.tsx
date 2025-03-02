import React from 'react';
import {useStore} from '../State/Store';

const AutoAnonymize: React.FC = () => {
  const { anonymizedText, setAnonymizedText, anonymizeText } = useStore();

  const handleAnonymizeClick = () => {
    anonymizeText();
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <textarea
          className="w-full p-2 border rounded"
          value={anonymizedText}
          onChange={(e: { target: { value: any; }; }) => setAnonymizedText(e.target.value)}
        />
      </div>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={handleAnonymizeClick}
      >
        Auto Anonymize
      </button>
    </div>
  );
};

export default AutoAnonymize;