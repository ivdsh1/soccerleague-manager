
import React, { useState } from 'react';
import { XMarkIcon } from './icons/Icons.jsx';
import { useI18n } from '../lib/i18n.js';

const ImportSaveModal = ({ isOpen, onClose, onImport }) => {
    const { t } = useI18n();
    const [saveString, setSaveString] = useState('');
    const [error, setError] = useState('');

    const handleImportClick = () => {
        if (!saveString.trim()) {
            setError(t('import.error_empty'));
            return;
        }
        try {
            onImport(saveString);
            // No need to close here, App.tsx will change state and unmount this
        } catch (err) {
            setError(err.message || t('import.error_invalid'));
        }
    };

    if (!isOpen) return null;

    return (
        React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" },
            React.createElement("div", { className: "bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-auto flex flex-col max-h-[90vh]" },
                React.createElement("div", { className: "p-4 border-b border-gray-700 relative flex justify-between items-center" },
                    React.createElement("h2", { className: "text-xl font-bold text-white" }, t('import.title')),
                    React.createElement("button", { onClick: onClose, className: "text-gray-400 hover:text-white" },
                        React.createElement(XMarkIcon, { className: "w-6 h-6" })
                    )
                ),
                React.createElement("div", { className: "p-6 space-y-4 overflow-y-auto" },
                    React.createElement("p", { className: "text-gray-300" }, t('import.body')),
                    React.createElement("textarea", {
                        value: saveString,
                        onChange: (e) => {
                            setSaveString(e.target.value);
                            setError('');
                        },
                        placeholder: t('import.placeholder'),
                        className: "w-full h-48 bg-gray-900 border border-gray-600 rounded-md p-3 text-sm text-gray-200 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    }),
                    error && React.createElement("p", { className: "text-red-400 text-sm text-center" }, error)
                ),
                 React.createElement("div", { className: "p-4 bg-gray-900/50 text-right mt-auto space-x-4" },
                     React.createElement("button", { onClick: onClose, className: "bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors" },
                        t('cancel')
                    ),
                    React.createElement("button", { onClick: handleImportClick, className: "bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors" },
                        t('import.load_button')
                    )
                )
            )
        )
    );
};

export default ImportSaveModal;
