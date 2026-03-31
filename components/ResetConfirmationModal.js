
import React from 'react';
import { XMarkIcon } from './icons/Icons.jsx';
import { useI18n } from '../lib/i18n.js';

const ResetConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    const { t } = useI18n();
    if (!isOpen) return null;

    return (
        React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" },
            React.createElement("div", { className: "bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-auto overflow-hidden" },
                React.createElement("div", { className: "p-4 border-b border-gray-700 relative flex justify-between items-center" },
                    React.createElement("h2", { className: "text-xl font-bold text-white" }, t('reset.title')),
                    React.createElement("button", { onClick: onClose, className: "text-gray-400 hover:text-white" },
                        React.createElement(XMarkIcon, { className: "w-6 h-6" })
                    )
                ),
                React.createElement("div", { className: "p-6 space-y-4" },
                    React.createElement("p", { className: "text-center text-red-400 font-semibold" }, t('reset.warning_title')),
                    React.createElement("p", { className: "text-gray-300" },
                        t('reset.warning_body')
                    ),
                    React.createElement("p", { className: "text-gray-300" },
                        t('reset.warning_undo')
                    )
                ),
                React.createElement("div", { className: "p-4 bg-gray-900/50 flex justify-end space-x-4" },
                    React.createElement("button", 
                        { 
                            onClick: onClose, 
                            className: "bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                        },
                        t('cancel')
                    ),
                    React.createElement("button", 
                        { 
                            onClick: onConfirm,
                            className: "bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                        },
                        t('reset.confirm_button')
                    )
                )
            )
        )
    );
};

export default ResetConfirmationModal;
