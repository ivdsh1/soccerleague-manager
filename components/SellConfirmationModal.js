
import React from 'react';
import { XMarkIcon } from './icons/Icons.jsx';
import { useI18n } from '../lib/i18n.js';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value);
};

const SellConfirmationModal = ({ player, onClose, onConfirm }) => {
    const { t, POSITION_NAMES } = useI18n();

    return (
        React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" },
            React.createElement("div", { className: "bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-auto overflow-hidden" },
                React.createElement("div", { className: "p-4 border-b border-gray-700 relative flex justify-between items-center" },
                    React.createElement("h2", { className: "text-xl font-bold text-white" }, t('squad.sell_player')),
                    React.createElement("button", { onClick: onClose, className: "text-gray-400 hover:text-white" },
                        React.createElement(XMarkIcon, { className: "w-6 h-6" })
                    )
                ),
                React.createElement("div", { className: "p-6 space-y-4" },
                     React.createElement("div", { className: "flex items-center space-x-4" },
                        React.createElement("div", { className: "p-2 bg-gray-700 rounded-full flex items-center justify-center w-20 h-20" },
                           React.createElement("span", { className: "text-5xl" }, "💸")
                        ),
                        React.createElement("div", null,
                            React.createElement("p", { className: "text-2xl font-bold" }, player.name),
                            React.createElement("p", { className: "text-gray-400" }, `${POSITION_NAMES[player.position]} | ${t('setup.skill_abbr')}: ${player.skill}`)
                        )
                    ),
                    React.createElement("p", { className: "text-center text-gray-300" },
                        t('squad.sell_confirmation', { playerName: player.name })
                    ),
                    React.createElement("div", { className: "bg-gray-900 p-4 rounded-lg space-y-3" },
                        React.createElement("div", { className: "flex justify-between items-center" },
                            React.createElement("span", { className: "text-gray-400" }, t('squad.sell_value'), ":"),
                            React.createElement("span", { className: "font-bold text-lg text-green-400" }, formatCurrency(player.value))
                        )
                    ),
                     React.createElement("p", { className: "text-xs text-center text-gray-500" }, t('squad.cant_be_undone'))
                ),
                 React.createElement("div", { className: "p-4 bg-gray-900/50 flex justify-center items-center space-x-4" },
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
                        t('squad.confirm_sale')
                    )
                )
            )
        )
    );
};

export default SellConfirmationModal;
