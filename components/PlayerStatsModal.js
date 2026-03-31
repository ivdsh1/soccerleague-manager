import React, { useState, useMemo } from 'react';
import { XMarkIcon } from './icons/Icons.jsx';
import { useI18n } from '../lib/i18n.js';
import LogoDisplay from './LogoDisplay.js';
import { getEloFromSkill, MIN_SQUAD_SIZE } from '../constants.js';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value);
};

const PlayerStatsModal = ({ player, playerStats, season, seasonHistory, onClose, onSell, currentSquadSize }) => {
    const { t, POSITION_NAMES } = useI18n();
    const [view, setView] = useState(`s${season}`); // 'career', 's1', 's2' etc.

    const canSell = currentSquadSize > MIN_SQUAD_SIZE;

    const seasonOptions = useMemo(() => [
        { key: 'career', label: t('stats.career_total') },
        { key: `s${season}`, label: t('stats.current_season', { season }) },
        ...seasonHistory.map(h => ({ key: `s${h.year - 2024 + 1}`, label: t('stats.season_year', { year: h.year }) })).reverse()
    ], [season, seasonHistory, t]);

    const statsData = useMemo(() => {
        if (!playerStats) return null;
        if (view === 'career') {
            return playerStats.career;
        }
        const seasonNum = parseInt(view.replace('s', ''));
        return playerStats.statsBySeason[seasonNum];
    }, [view, playerStats]);

    const teamInfo = useMemo(() => {
        if (view === 'career' || !statsData) {
            // For career, we might not have a single team, so we can omit or show last known team
            const lastSeason = playerStats ? Object.keys(playerStats.statsBySeason).pop() : null;
            const lastTeamData = lastSeason ? playerStats.statsBySeason[lastSeason] : null;
            return lastTeamData ? { name: lastTeamData.teamName, emoji: lastTeamData.teamEmoji, logo: lastTeamData.teamLogo } : null;
        }
        return { name: statsData.teamName, emoji: statsData.teamEmoji, logo: statsData.teamLogo };
    }, [statsData, view, playerStats]);

    const competitionOrder = ['total', 'MSSL', 'ISL', 'LA', 'CSL', 'USL', 'ASL', 'CA'];
    const statKeys = [
        { key: 'matchesPlayed', label: t('stats.matches_played_abbr'), long: t('stats.matches_played_long') },
        { key: 'goals', label: t('stats.goals_abbr'), long: t('stats.goals_long') },
        { key: 'assists', label: t('stats.assists_abbr'), long: t('stats.assists_long') },
        { key: 'yellowCards', label: '🟨', long: 'Cartões Amarelos' },
        { key: 'redCards', label: '🟥', long: 'Cartões Vermelhos' },
    ];

    const elo = getEloFromSkill(player.skill);
    
    return (
        React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" },
            React.createElement("div", { className: "bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-auto flex flex-col max-h-[90vh]" },
                React.createElement("div", { className: "p-4 border-b border-gray-700 relative flex justify-between items-center flex-shrink-0" },
                    React.createElement("h2", { className: "text-xl font-bold text-white" }, "Detalhes do Jogador"),
                    React.createElement("button", { onClick: onClose, className: "text-gray-400 hover:text-white" },
                        React.createElement(XMarkIcon, { className: "w-6 h-6" })
                    )
                ),
                
                React.createElement("div", { className: "p-4 space-y-4 overflow-y-auto" },
                    React.createElement("div", { className: "bg-gray-900/50 p-4 rounded-lg flex items-center space-x-4" },
                        React.createElement("div", { className: "w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-5xl flex-shrink-0" }, "👤"),
                        React.createElement("div", { className: "flex-grow" },
                            React.createElement("h3", { className: "text-2xl font-bold" }, player.name),
                            React.createElement("div", { className: "text-gray-400 text-sm" },
                                `${POSITION_NAMES[player.position]} | ${player.age} ${t('age').toLowerCase()}`
                            )
                        ),
                        React.createElement("div", { className: "text-center" },
                            React.createElement("p", { className: "text-xs text-gray-400 uppercase" }, t('skill_abbr_long')),
                            React.createElement("div", { className: `text-4xl font-bold flex items-center gap-2 ${elo.color}` },
                                React.createElement("span", { title: t(elo.nameKey) }, elo.icon),
                                React.createElement("span", null, player.skill)
                            )
                        )
                    ),

                    React.createElement("div", { className: "grid grid-cols-2 gap-4 text-center" },
                        React.createElement("div", { className: "bg-gray-900/50 p-3 rounded-lg" },
                            React.createElement("p", { className: "text-xs text-gray-400" }, t('market.value')),
                            React.createElement("p", { className: "text-lg font-bold text-green-400" }, formatCurrency(player.value))
                        ),
                        React.createElement("div", { className: "bg-gray-900/50 p-3 rounded-lg" },
                            React.createElement("p", { className: "text-xs text-gray-400" }, t('market.salary_per_round')),
                            React.createElement("p", { className: "text-lg font-bold text-yellow-400" }, formatCurrency(player.salary))
                        )
                    ),
                    
                    React.createElement("div", { className: "pt-2" },
                        React.createElement("div", { className: "flex justify-center p-1 space-x-1 bg-gray-900 rounded-lg flex-wrap mb-4" },
                            seasonOptions.map(opt => (
                                playerStats?.statsBySeason[parseInt(opt.key.replace('s', ''))] || opt.key === 'career' ? (
                                    React.createElement("button", {
                                        key: opt.key,
                                        onClick: () => setView(opt.key),
                                        className: `flex-grow px-3 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors ${view === opt.key ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`
                                    }, opt.label)
                                ) : null
                            ))
                        ),
                        
                        statsData ? (
                            React.createElement("div", { className: "bg-gray-900/50 rounded-lg overflow-hidden" },
                                React.createElement("div", { className: "overflow-x-auto" },
                                    React.createElement("table", { className: "w-full text-sm text-left text-gray-300" },
                                        React.createElement("thead", { className: "text-xs text-gray-400 uppercase bg-gray-700/50" },
                                            React.createElement("tr", null,
                                                React.createElement("th", { scope: "col", className: "px-4 py-3" }, "Competição"),
                                                statKeys.map(sk => React.createElement("th", { key: sk.key, scope: "col", className: "px-3 py-3 text-center", title: sk.long }, sk.label))
                                            )
                                        ),
                                        React.createElement("tbody", null,
                                            competitionOrder.map(compKey => (
                                                statsData[compKey] && statsData[compKey].matchesPlayed > 0 && (
                                                    React.createElement("tr", { key: compKey, className: `border-b border-gray-700 ${compKey === 'total' ? 'bg-gray-700 font-bold' : ''}` },
                                                        React.createElement("td", { className: "px-4 py-3" }, compKey === 'total' ? 'Total' : t(`competition.${compKey}`)),
                                                        statKeys.map(sk => React.createElement("td", { key: sk.key, className: "px-3 py-3 text-center" }, statsData[compKey][sk.key] || 0))
                                                    )
                                                )
                                            ))
                                        )
                                    )
                                )
                            )
                        ) : (
                             React.createElement("div", { className: "text-center text-gray-500 py-8 bg-gray-900/50 rounded-lg" }, "Nenhuma estatística para esta temporada.")
                        )
                    )
                ),

                React.createElement("div", { className: "p-4 bg-gray-900/50 text-right mt-auto flex-shrink-0 flex justify-between items-center" },
                    React.createElement("div", null,
                        React.createElement("button", { 
                            onClick: () => onSell(player), 
                            disabled: !canSell,
                            title: !canSell ? t('notification.min_squad_reached', { min: MIN_SQUAD_SIZE }) : "",
                            className: `font-bold py-2 px-6 rounded-lg transition-colors ${canSell ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}` 
                        },
                            t('squad.sell_player')
                        ),
                        !canSell && React.createElement("p", { className: "text-[10px] text-red-400 mt-1" }, t('notification.min_squad_reached', { min: MIN_SQUAD_SIZE }))
                    ),
                    React.createElement("button", { onClick: onClose, className: "bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors" },
                        t('close')
                    )
                )
            )
        )
    );
};

export default PlayerStatsModal;