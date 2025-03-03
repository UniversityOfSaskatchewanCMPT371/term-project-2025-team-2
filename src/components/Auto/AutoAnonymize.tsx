import React from 'react';
import { useStore } from '../State/Store';
import { AutoAnon } from './AutoClean';

const AutoAnonymize: React.FC = () => {
  const dicomData = useStore((state) => state.dicomData);
  const files = useStore((state) => state.files);

  const handleAnonymizeClick = async () => {
    if (dicomData.length > 0 && files.length > 0) {
      await AutoAnon(dicomData, files);
    }
  };

  return (
    <div className="p-4">
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