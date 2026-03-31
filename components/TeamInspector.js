
import React, { useState, useEffect } from 'react';
import LogoDisplay from './LogoDisplay.js';
import { useI18n } from '../lib/i18n.js';
import { getEloFromSkill } from '../constants.js';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value);
};

const TeamInspector = ({ allTeams, initialTeamId }) => {
    const { t, POSITION_NAMES } = useI18n();
    const [selectedTeamId, setSelectedTeamId] = useState(initialTeamId || allTeams[0]?.id || null);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    
    const selectedTeam = allTeams.find(t => t.id === selectedTeamId);

    useEffect(() => {
        if (initialTeamId) setSelectedTeamId(initialTeamId);
    }, [initialTeamId]);

    return (
        React.createElement("div", { className: "space-y-6" },
            
            React.createElement("div", { className: "bg-gray-800 p-4 rounded-lg" },
                React.createElement("label", { htmlFor: "team-inspector-select", className: "block text-sm font-medium text-gray-300 mb-1" }, t('inspector.select_team_label')),
                 React.createElement("select",
                    {
                        id: "team-inspector-select",
                        value: selectedTeamId || '',
                        onChange: e => setSelectedTeamId(Number(e.target.value)),
                        className: "w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    },
                    allTeams.sort((a,b) => a.name.localeCompare(b.name)).map(team => (
                        React.createElement("option", { key: team.id, value: team.id }, team.name)
                    ))
                )
            ),
            
            !selectedTeam ? (
                React.createElement("div", { className: "flex items-center justify-center h-64 bg-gray-800 rounded-lg" },
                    React.createElement("p", { className: "text-gray-400" }, t('inspector.select_team_placeholder'))
                )
            ) : (
                React.createElement("div", { className: "space-y-4" },
                    React.createElement("div", { className: "bg-gray-800 p-4 rounded-lg flex items-center space-x-4" },
                        React.createElement(LogoDisplay, { team: selectedTeam, style: "emoji", className: "text-5xl" }),
                        React.createElement("div", null,
                            React.createElement("h3", { className: "text-2xl font-bold" }, selectedTeam.name),
                            React.createElement("p", { className: "text-gray-400" }, `${t('inspector.division')}: ${selectedTeam.division} | ${t('inspector.avg_skill')}: ${selectedTeam.skill}`)
                        )
                    ),
                    
                    React.createElement("div", { className: "bg-gray-800 rounded-lg shadow-lg overflow-hidden" },
                        React.createElement("div", { className: "overflow-x-auto" },
                            React.createElement("table", { className: "w-full text-sm text-left text-gray-300" },
                                React.createElement("thead", { className: "text-xs text-gray-400 uppercase bg-gray-700" },
                                    React.createElement("tr", null,
                                        React.createElement("th", { scope: "col", className: "px-6 py-3" }, t('inspector.player')),
                                        React.createElement("th", { scope: "col", className: "px-3 py-3 text-center" }, t('inspector.pos')),
                                        React.createElement("th", { scope: "col", className: "px-3 py-3 text-center" }, t('inspector.age')),
                                        React.createElement("th", { scope: "col", className: "px-3 py-3 text-center" }, t('inspector.skill')),
                                        React.createElement("th", { scope: "col", className: "px-6 py-3 text-right" }, t('inspector.salary_per_round')),
                                        React.createElement("th", { scope: "col", className: "px-6 py-3 text-right" }, t('inspector.value'))
                                    )
                                ),
                                React.createElement("tbody", null,
                                    selectedTeam.players.sort((a,b) => b.skill - a.skill).map((player, idx) => {
                                        const elo = getEloFromSkill(player.skill);
                                        return (
                                        React.createElement("tr", { key: `${player.id}-${selectedTeamId}-${idx}`, className: "border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer transition-colors", onClick: () => setSelectedPlayer(player) },
                                            React.createElement("td", { className: "px-6 py-4 font-semibold text-white" }, player.name),
                                            React.createElement("td", { className: "px-3 py-4 text-center" }, POSITION_NAMES[player.position]),
                                            React.createElement("td", { className: "px-3 py-4 text-center" }, player.age),
                                            React.createElement("td", { className: "px-3 py-4 text-center font-bold text-lg" }, 
                                                React.createElement("div", { className: `flex items-center justify-center gap-2 ${elo.color}` },
                                                    React.createElement("span", { title: t(elo.nameKey) }, elo.icon),
                                                    React.createElement("span", null, player.skill)
                                                )
                                            ),
                                            React.createElement("td", { className: "px-6 py-4 text-right font-mono text-yellow-300" }, formatCurrency(player.salary)),
                                            React.createElement("td", { className: "px-6 py-4 text-right font-mono text-green-400" }, formatCurrency(player.value))
                                        )
                                    )})
                                )
                            )
                        ),
                        selectedTeam.players.length === 0 && (
                            React.createElement("p", { className: "text-center text-gray-500 py-8" }, t('inspector.no_players'))
                        )
                    )
                )
            ),

            selectedPlayer && React.createElement("div", { className: "fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4" },
                React.createElement("div", { className: "bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-700" },
                    React.createElement("div", { className: "p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/50" },
                        React.createElement("h3", { className: "text-xl font-bold" }, t('inspector.player_details')),
                        React.createElement("button", { onClick: () => setSelectedPlayer(null), className: "text-gray-400 hover:text-white" }, "✕")
                    ),
                    React.createElement("div", { className: "p-6 space-y-6" },
                        React.createElement("div", { className: "flex items-center space-x-4" },
                            React.createElement("div", { className: "w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-3xl shadow-inner" }, "👤"),
                            React.createElement("div", null,
                                React.createElement("h4", { className: "text-2xl font-bold text-white" }, selectedPlayer.name),
                                React.createElement("p", { className: "text-blue-400 font-medium" }, `${POSITION_NAMES[selectedPlayer.position]} | ${t('inspector.age_years', { age: selectedPlayer.age })}`)
                            )
                        ),
                        React.createElement("div", { className: "grid grid-cols-2 gap-4" },
                            React.createElement("div", { className: "bg-gray-900/50 p-3 rounded-xl border border-gray-700" },
                                React.createElement("p", { className: "text-xs text-gray-500 uppercase font-bold mb-1" }, t('inspector.skill_label')),
                                React.createElement("p", { className: `text-xl font-bold ${getEloFromSkill(selectedPlayer.skill).color}` }, selectedPlayer.skill)
                            ),
                            React.createElement("div", { className: "bg-gray-900/50 p-3 rounded-xl border border-gray-700" },
                                React.createElement("p", { className: "text-xs text-gray-500 uppercase font-bold mb-1" }, t('inspector.value_label')),
                                React.createElement("p", { className: "text-xl font-bold text-green-400" }, formatCurrency(selectedPlayer.value))
                            )
                        ),
                        React.createElement("div", null,
                            React.createElement("h5", { className: "text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center" }, 
                                React.createElement("span", { className: "mr-2" }, "🕒"), t('inspector.team_history')
                            ),
                            React.createElement("div", { className: "space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar" },
                                selectedPlayer.teamHistory && selectedPlayer.teamHistory.length > 0 ? (
                                    selectedPlayer.teamHistory.map((teamName, i) => (
                                        React.createElement("div", { key: i, className: "flex items-center justify-between p-2 bg-gray-700/30 rounded-lg border border-gray-600/50" },
                                            React.createElement("span", { className: "text-gray-200" }, teamName),
                                            i === 0 && React.createElement("span", { className: "text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold uppercase" }, t('inspector.current'))
                                        )
                                    ))
                                ) : (
                                    React.createElement("p", { className: "text-gray-500 italic text-sm" }, t('inspector.no_history'))
                                )
                            )
                        )
                    ),
                    React.createElement("div", { className: "p-4 bg-gray-900/50 border-t border-gray-700" },
                        React.createElement("button", { 
                            onClick: () => setSelectedPlayer(null),
                            className: "w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors"
                        }, t('close'))
                    )
                )
            )
        )
    );
};

export default TeamInspector;