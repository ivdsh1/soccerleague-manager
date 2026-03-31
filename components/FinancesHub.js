
import React from 'react';
import { useI18n } from '../lib/i18n.js';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value);
};

const FinancesHub = ({ userTeam, onTakeLoan }) => {
    const { t } = useI18n();

    const LOAN_OPTIONS = [
        { key: 'loan1', principal: 500000, interest: 0.20, duration: 10 },
        { key: 'loan2', principal: 2000000, interest: 0.15, duration: 20 },
        { key: 'loan3', principal: 10000000, interest: 0.30, duration: 30 },
    ];

    const activeLoan = userTeam.loan;

    return (
        React.createElement("div", { className: "space-y-6" },
            React.createElement("div", { className: "bg-gray-800 p-4 rounded-lg text-center" },
                React.createElement("h2", { className: "text-xl font-semibold text-white" }, t('finances.financial_situation')),
                React.createElement("p", { className: "text-3xl font-bold mt-2", style: { color: userTeam.budget >= 0 ? '#4ade80' : '#f87171' } },
                    formatCurrency(userTeam.budget)
                ),
                React.createElement("p", { className: "text-sm text-gray-400" }, t('finances.current_balance'))
            ),

            activeLoan ? (
                React.createElement("div", { className: "bg-gray-800 p-6 rounded-lg" },
                    React.createElement("h3", { className: "text-xl font-semibold text-center text-white mb-4" }, t('finances.active_loan')),
                    React.createElement("div", { className: "bg-gray-900 p-4 rounded-lg space-y-3 text-sm" },
                        React.createElement("div", { className: "flex justify-between" },
                            React.createElement("span", { className: "text-gray-400" }, t('finances.principal_amount'), ":"),
                            React.createElement("span", { className: "font-semibold" }, formatCurrency(activeLoan.principal))
                        ),
                        React.createElement("div", { className: "flex justify-between" },
                            React.createElement("span", { className: "text-gray-400" }, t('finances.remaining_debt'), ":"),
                            React.createElement("span", { className: "font-semibold text-red-400" }, formatCurrency(activeLoan.totalOwed))
                        ),
                         React.createElement("div", { className: "flex justify-between" },
                            React.createElement("span", { className: "text-gray-400" }, t('finances.payment_per_round'), ":"),
                            React.createElement("span", { className: "font-semibold text-yellow-400" }, formatCurrency(activeLoan.repaymentPerRound))
                        ),
                        React.createElement("div", { className: "flex justify-between" },
                            React.createElement("span", { className: "text-gray-400" }, t('finances.rounds_remaining'), ":"),
                            React.createElement("span", { className: "font-semibold" }, activeLoan.roundsRemaining)
                        )
                    ),
                     React.createElement("p", { className: "text-xs text-gray-500 mt-4 text-center" }, t('finances.must_repay_loan'))
                )
            ) : (
                React.createElement("div", null,
                     React.createElement("h3", { className: "text-xl font-semibold text-center text-white mb-4" }, t('finances.loan_options')),
                     React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6" },
                        LOAN_OPTIONS.map((option) => {
                            const totalRepayment = Math.floor(option.principal * (1 + option.interest));
                            return (
                                React.createElement("div", { key: option.key, className: "bg-gray-800 p-5 rounded-lg flex flex-col text-center shadow-lg border border-gray-700" },
                                    React.createElement("h4", { className: "text-lg font-bold text-blue-400 mb-2" }, t(`finances.${option.key}_title`)),
                                    React.createElement("p", { className: "text-sm text-gray-400 flex-grow mb-4" }, t(`finances.${option.key}_desc`)),
                                    
                                    React.createElement("div", { className: "space-y-2 text-sm mb-4" },
                                        React.createElement("p", null, React.createElement("span", { className: "font-semibold" }, t('finances.amount'), ":"), " ", formatCurrency(option.principal)),
                                        React.createElement("p", null, React.createElement("span", { className: "font-semibold" }, t('finances.total_repayment'), ":"), " ", formatCurrency(totalRepayment)),
                                        React.createElement("p", null, React.createElement("span", { className: "font-semibold" }, t('finances.duration'), ":"), " ", option.duration, " ", t('finances.rounds'))
                                    ),

                                    React.createElement("button",
                                        {
                                            onClick: () => onTakeLoan(option),
                                            className: "mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                        },
                                        t('finances.take_loan')
                                    )
                                )
                            );
                        })
                    )
                )
            )
        )
    );
};

export default FinancesHub;
