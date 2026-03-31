import React from 'react';
import { XMarkIcon } from './icons/Icons.jsx';
import { useI18n } from '../lib/i18n.js';
import { UPDATE_NOTES } from '../data/updates.js';

const UpdatesModal = ({ onClose }) => {
    const { t, locale } = useI18n();
    
    // Get notes for the current locale, with fallbacks to ensure content is always shown
    const localeData = UPDATE_NOTES[locale] || UPDATE_NOTES['pt-BR'] || UPDATE_NOTES['en-US'];
    const latestUpdate = localeData?.notes[0];

    // Render nothing if there are no updates to show
    if (!latestUpdate) {
        return (
             React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" },
                React.createElement("div", { className: "bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-auto flex flex-col" },
                    React.createElement("div", { className: "p-4 border-b border-gray-700 relative flex justify-between items-center" },
                        React.createElement("h2", { className: "text-xl font-bold text-white" }, t('updates.title')),
                        React.createElement("button", { onClick: onClose, className: "text-gray-400 hover:text-white" },
                            React.createElement(XMarkIcon, { className: "w-6 h-6" })
                        )
                    ),
                    React.createElement("div", { className: "p-6 text-center text-gray-400" }, "Nenhuma nota de atualização disponível."),
                    React.createElement("div", { className: "p-4 bg-gray-900/50 text-right mt-auto" },
                        React.createElement("button", { onClick: onClose, className: "bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors" },
                            t('close')
                        )
                    )
                )
            )
        );
    }

    return (
        React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" },
            React.createElement("div", { className: "bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-auto flex flex-col max-h-[90vh]" },
                React.createElement("div", { className: "p-4 border-b border-gray-700 relative flex justify-between items-center flex-shrink-0" },
                    React.createElement("h2", { className: "text-xl font-bold text-white" }, t('updates.title')),
                    React.createElement("button", { onClick: onClose, className: "text-gray-400 hover:text-white" },
                        React.createElement(XMarkIcon, { className: "w-6 h-6" })
                    )
                ),
                React.createElement("div", { className: "p-6 space-y-4 overflow-y-auto" },
                    React.createElement("h3", { className: "text-lg font-semibold text-blue-400" }, `Versão ${latestUpdate.version} - ${latestUpdate.title}`),
                    React.createElement("p", { className: "text-gray-400 text-sm" }, `${localeData.release_prefix} ${latestUpdate.date}`),
                    
                    latestUpdate.sections.map((section, index) => (
                        React.createElement("div", { key: index, className: "pt-4" },
                            React.createElement("h4", { className: `text-md font-bold ${section.colorClass}` }, section.title),
                            React.createElement("ul", { className: "list-disc list-inside space-y-2 text-gray-300 pl-4 mt-2" },
                                section.notes.map((note, noteIndex) => (
                                    React.createElement("li", { key: noteIndex, dangerouslySetInnerHTML: { __html: note } })
                                ))
                            )
                        )
                    ))
                ),
                React.createElement("div", { className: "p-4 bg-gray-900/50 text-right mt-auto flex-shrink-0" },
                    React.createElement("button", { onClick: onClose, className: "bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors" },
                        t('close')
                    )
                )
            )
        )
    );
};

export default UpdatesModal;
