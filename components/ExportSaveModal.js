
import React, { useState, useRef } from 'react';
import { XMarkIcon } from './icons/Icons.jsx';
import { useI18n } from '../lib/i18n.js';

const ExportSaveModal = ({ isOpen, onClose, saveDataString }) => {
    const { t } = useI18n();
    const [copySuccess, setCopySuccess] = useState('');
    const textAreaRef = useRef(null);

    const copyToClipboard = (e) => {
        if (textAreaRef.current) {
            textAreaRef.current.select();
            document.execCommand('copy');
            e.currentTarget.focus();
            setCopySuccess(t('notification.copied'));
            setTimeout(() => setCopySuccess(''), 2000);
        }
    };

    if (!isOpen) return null;

    return (
        React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" },
            React.createElement("div", { className: "bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-auto flex flex-col max-h-[90vh]" },
                React.createElement("div", { className: "p-4 border-b border-gray-700 relative flex justify-between items-center" },
                    React.createElement("h2", { className: "text-xl font-bold text-white" }, t('export.title')),
                    React.createElement("button", { onClick: onClose, className: "text-gray-400 hover:text-white" },
                        React.createElement(XMarkIcon, { className: "w-6 h-6" })
                    )
                ),
                React.createElement("div", { className: "p-6 space-y-4 overflow-y-auto" },
                    React.createElement("p", { className: "text-gray-300" }, t('export.body')),
                    React.createElement("textarea", {
                        ref: textAreaRef,
                        readOnly: true,
                        value: saveDataString,
                        className: "w-full h-48 bg-gray-900 border border-gray-600 rounded-md p-3 text-sm text-gray-200 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    }),
                     React.createElement("div", { className: "text-center" },
                        React.createElement("button", { onClick: copyToClipboard, className: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors" },
                            copySuccess || t('export.copy_button')
                        )
                    )
                ),
                 React.createElement("div", { className: "p-4 bg-gray-900/50 text-right mt-auto" },
                    React.createElement("button", { onClick: onClose, className: "bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors" },
                        t('close')
                    )
                )
            )
        )
    );
};

export default ExportSaveModal;
