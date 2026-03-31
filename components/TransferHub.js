
import React, { useState, useMemo } from 'react';
import LogoDisplay from './LogoDisplay.js';
import { XMarkIcon } from './icons/Icons.jsx';
import { useI18n } from '../lib/i18n.js';
import { getEloFromSkill } from '../constants.js';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value);
};

const PurchaseConfirmationModal = ({ player, onClose, onConfirm, userBudget, userSquadSize, squadSizeLimit }) => {
    const { t, POSITION_NAMES } = useI18n();
    const canAfford = userBudget >= player.value;
    const hasSpace = userSquadSize < squadSizeLimit;
    const canPurchase = canAfford && hasSpace;

    return (
        React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" },
            React.createElement("div", { className: "bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-auto overflow-hidden" },
                React.createElement("div", { className: "p-4 border-b border-gray-700 relative flex justify-between items-center" },
                    React.createElement("h2", { className: "text-xl font-bold text-white" }, t('market.confirm_transfer')),
                    React.createElement("button", { onClick: onClose, className: "text-gray-400 hover:text-white" },
                        React.createElement(XMarkIcon, { className: "w-6 h-6" })
                    )
                ),
                React.createElement("div", { className: "p-6 space-y-4" },
                    React.createElement("div", { className: "flex items-center space-x-4" },
                        React.createElement("div", { className: "p-2 bg-gray-700 rounded-full flex items-center justify-center w-20 h-20" },
                           React.createElement(LogoDisplay, { team: {logo: player.teamLogo, emoji: player.teamEmoji, name: player.teamName}, style: "emoji", className: "text-5xl" })
                        ),
                        React.createElement("div", null,
                            React.createElement("p", { className: "text-2xl font-bold" }, player.name),
                            React.createElement("p", { className: "text-gray-400" }, `${POSITION_NAMES[player.position]} | ${t('setup.skill_abbr')}: ${player.skill}`),
                            React.createElement("p", { className: "text-sm text-gray-500" }, `${t('market.current_team')}: ${player.teamName}`)
                        )
                    ),
                    React.createElement("div", { className: "bg-gray-900 p-4 rounded-lg space-y-3" },
                         React.createElement("div", { className: "flex justify-between items-center" },
                            React.createElement("span", { className: "text-gray-400" }, t('market.salary_per_round'), ":"),
                            React.createElement("span", { className: "font-bold text-yellow-400" }, formatCurrency(player.salary))
                        ),
                        React.createElement("div", { className: "flex justify-between items-center" },
                            React.createElement("span", { className: "text-gray-400" }, t('market.value'), ":"),
                            React.createElement("span", { className: "font-bold text-lg text-green-400" }, formatCurrency(player.value))
                        ),
                        React.createElement("div", { className: "flex justify-between items-center" },
                            React.createElement("span", { className: "text-gray-400" }, t('market.current_budget'), ":"),
                            React.createElement("span", { className: `font-bold ${canAfford ? 'text-white' : 'text-red-400'}` }, formatCurrency(userBudget))
                        ),
                         React.createElement("div", { className: "flex justify-between items-center border-t border-gray-700 pt-3" },
                            React.createElement("span", { className: "text-gray-400" }, t('market.remaining_budget'), ":"),
                            React.createElement("span", { className: `font-bold text-lg ${canAfford ? 'text-yellow-400' : 'text-red-400'}` }, formatCurrency(userBudget - player.value))
                        )
                    ),
                     !canAfford && React.createElement("p", { className: "text-red-400 text-sm text-center" }, t('market.not_enough_budget')),
                     !hasSpace && React.createElement("p", { className: "text-red-400 text-sm text-center" }, t('market.squad_full', { userSquadSize, squadSizeLimit }))
                ),
                 React.createElement("div", { className: "p-4 bg-gray-900/50 text-right" },
                    React.createElement("button", 
                        { 
                            onClick: () => onConfirm(player, player.teamId), 
                            disabled: !canPurchase,
                            className: "bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg transition-colors"
                        },
                        t('market.hire_button')
                    )
                )
            )
        )
    );
};


const TransferHub = ({ userTeam, allTeams, onPurchasePlayer, squadSizeLimit }) => {
    const { t, POSITION_NAMES } = useI18n();
    const [searchTerm, setSearchTerm] = useState('');
    const [positionFilter, setPositionFilter] = useState('ALL');
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const availablePlayers = useMemo(() => {
        return allTeams
            .filter(t => t.id !== userTeam.id)
            .flatMap(team =>
                team.players.map(player => ({
                    ...player,
                    teamName: team.name,
                    teamLogo: team.logo,
                    teamEmoji: team.emoji,
                    teamId: team.id
                }))
            );
    }, [allTeams, userTeam.id]);

    const filteredPlayers = useMemo(() => {
        return availablePlayers
            .filter(player => {
                const nameMatch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
                const positionMatch = positionFilter === 'ALL' || player.position === positionFilter;
                return nameMatch && positionMatch;
            })
            .sort((a, b) => b.skill - a.skill);
    }, [availablePlayers, searchTerm, positionFilter]);
    
    const handleConfirmPurchase = (player, sellerTeamId) => {
        onPurchasePlayer(player, sellerTeamId);
        setSelectedPlayer(null); // Close the modal after the purchase logic is executed
    };

    return (
        React.createElement("div", { className: "space-y-6" },
            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-center" },
                React.createElement("div", { className: "bg-gray-800 p-4 rounded-lg" },
                    React.createElement("p", { className: "text-sm text-gray-400 uppercase" }, t('market.budget')),
                    React.createElement("p", { className: `text-2xl font-bold ${userTeam.budget >= 0 ? 'text-green-400' : 'text-red-400'}` }, formatCurrency(userTeam.budget))
                ),
                React.createElement("div", { className: "bg-gray-800 p-4 rounded-lg" },
                     React.createElement("p", { className: "text-sm text-gray-400 uppercase" }, t('market.squad_size')),
                    React.createElement("p", { className: "text-2xl font-bold text-white" }, `${userTeam.players.length} / ${squadSizeLimit}`)
                )
            ),

            React.createElement("div", { className: "bg-gray-800 p-4 rounded-lg space-y-4 md:space-y-0 md:flex md:items-center md:justify-between" },
                 React.createElement("div", { className: "flex-grow md:mr-4" },
                    React.createElement("input", {
                        type: "text",
                        placeholder: t('market.search_placeholder'),
                        value: searchTerm,
                        onChange: (e) => setSearchTerm(e.target.value),
                        className: "w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    })
                ),
                React.createElement("div", { className: "flex-shrink-0" },
                    React.createElement("select",
                        {
                            value: positionFilter,
                            onChange: (e) => setPositionFilter(e.target.value),
                             className: "w-full md:w-auto bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        },
                        React.createElement("option", { value: "ALL" }, t('market.all_positions')),
                        Object.entries(POSITION_NAMES).map(([key, name]) => (
                            React.createElement("option", { key: key, value: key }, name)
                        ))
                    )
                )
            ),

            React.createElement("div", { className: "bg-gray-800 rounded-lg shadow-lg overflow-hidden" },
                React.createElement("div", { className: "overflow-x-auto" },
                    React.createElement("table", { className: "w-full text-sm text-left text-gray-300" },
                        React.createElement("thead", { className: "text-xs text-gray-400 uppercase bg-gray-700" },
                            React.createElement("tr", null,
                                React.createElement("th", { scope: "col", className: "px-6 py-3" }, t('market.player')),
                                React.createElement("th", { scope: "col", className: "px-3 py-3 text-center" }, t('market.pos')),
                                React.createElement("th", { scope: "col", className: "px-3 py-3 text-center" }, t('market.skill')),
                                React.createElement("th", { scope: "col", className: "px-6 py-3" }, t('market.current_team')),
                                React.createElement("th", { scope: "col", className: "px-6 py-3 text-right" }, t('market.salary_per_round')),
                                React.createElement("th", { scope: "col", className: "px-6 py-3 text-right" }, t('market.value'))
                            )
                        ),
                        React.createElement("tbody", null,
                            filteredPlayers.map((player) => {
                                const elo = getEloFromSkill(player.skill);
                                return (
                                React.createElement("tr", 
                                    {
                                        key: `${player.id}-${player.teamId}`,
                                        onClick: () => setSelectedPlayer(player),
                                        className: "border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer"
                                    },
                                    React.createElement("td", { className: "px-6 py-4 font-semibold text-white" }, player.name),
                                    React.createElement("td", { className: "px-3 py-4 text-center" }, POSITION_NAMES[player.position]),
                                    React.createElement("td", { className: "px-3 py-4 text-center font-bold text-lg" }, 
                                        React.createElement("div", { className: `flex items-center justify-center gap-2 ${elo.color}` },
                                            React.createElement("span", { title: t(elo.nameKey) }, elo.icon),
                                            React.createElement("span", null, player.skill)
                                        )
                                    ),
                                    React.createElement("td", { className: "px-6 py-4" },
                                        React.createElement("div", { className: "flex items-center space-x-2" },
                                            React.createElement(LogoDisplay, { team: {logo: player.teamLogo, emoji: player.teamEmoji, name: player.teamName}, style: "emoji", className: "text-lg w-5 text-center" }),
                                            React.createElement("span", null, player.teamName)
                                        )
                                    ),
                                    React.createElement("td", { className: "px-6 py-4 text-right font-mono text-yellow-300" }, formatCurrency(player.salary)),
                                    React.createElement("td", { className: "px-6 py-4 text-right font-mono text-green-400" }, formatCurrency(player.value))
                                )
                            )})
                        )
                    )
                ),
                 filteredPlayers.length === 0 && (
                    React.createElement("p", { className: "text-center text-gray-500 py-8" }, t('market.no_players_found'))
                )
            ),
            
            selectedPlayer && (
                React.createElement(PurchaseConfirmationModal, {
                    player: selectedPlayer,
                    onClose: () => setSelectedPlayer(null),
                    onConfirm: handleConfirmPurchase,
                    userBudget: userTeam.budget,
                    userSquadSize: userTeam.players.length,
                    squadSizeLimit: squadSizeLimit
                })
            )
        )
    );
};

export default TransferHub;