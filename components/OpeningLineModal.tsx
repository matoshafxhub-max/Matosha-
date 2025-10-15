import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon } from './icons';

interface OpeningLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  openingLine: string;
}

const OpeningLineModal: React.FC<OpeningLineModalProps> = ({ isOpen, onClose, isLoading, openingLine }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  const handleCopy = () => {
    if(openingLine) {
        navigator.clipboard.writeText(openingLine);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center transition-all duration-300">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Anzisha Mazungumzo!</h2>
        <p className="text-slate-600 mb-6">Tumekuandalia laini ya kuanzia mazungumzo:</p>
        
        <div className="bg-slate-100 p-4 rounded-lg min-h-[100px] flex items-center justify-center mb-6">
          {isLoading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
          ) : (
            <p className="text-lg italic text-slate-700">"{openingLine}"</p>
          )}
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors duration-200"
          >
            Funga
          </button>
          <button
            onClick={handleCopy}
            disabled={isLoading || copied}
            className="w-full py-3 px-4 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors duration-200 flex items-center justify-center disabled:bg-teal-300 disabled:cursor-not-allowed"
          >
            {copied ? <CheckIcon/> : <CopyIcon/>}
            <span className="ml-2">{copied ? 'Imenakiliwa!' : 'Nakili'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpeningLineModal;
