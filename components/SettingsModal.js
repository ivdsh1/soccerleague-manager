
import React, { useState, useEffect, useMemo } from 'react';
import { XMarkIcon, Cog6ToothIcon, UsersIcon, ForwardIcon } from './icons/Icons.jsx';
import { useI18n } from '../lib/i18n.js';

const TabButton = ({ id, label, activeTab, onSelect, icon }) => (
    React.createElement("button", {
        onClick: () => onSelect(id),
        className: `flex-1 flex items-center justify-center space-x-2 px-3 py-3 text-sm font-bold transition-colors border-b-2 ${
            activeTab === id
                ? 'text-blue-400 border-blue-400'
                : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'
        }`
    },
        icon,
        React.createElement("span", null, label)
    )
);

const ControlGroup = ({ title, children, description }) => (
    React.createElement("div", { className: "bg-gray-900/50 p-4 rounded-lg border border-gray-700" },
        React.createElement("h3", { className: "font-semibold text-white mb-1" }, title),
        description && React.createElement("p", { className: "text-xs text-gray-400 mb-3" }, description),
        React.createElement("div", { className: "space-y-3" }, children)
    )
);

const TeamCheatsTab = ({ allTeams, isProcessing, onAdminMoneyChange, onAdminPointsChange, onAdminBulkSkillChange }) => {
    const { t } = useI18n();
    const [selectedTeamId, setSelectedTeamId] = useState(allTeams[0]?.id || null);
    const [moneyAmount, setMoneyAmount] = useState('10000000');
    const [pointsAmount, setPointsAmount] = useState('3');
    const [bulkSkillAmount, setBulkSkillAmount] = useState('99');

    const selectedTeam = allTeams.find(t => t.id === selectedTeamId);

    return (
        React.createElement("div", { className: "space-y-4" },
            React.createElement("div", null,
                React.createElement("label", { className: "block text-sm font-medium text-gray-300 mb-1" }, t('admin.select_team')),
                React.createElement("select",
                    {
                        value: selectedTeamId || '',
                        onChange: e => setSelectedTeamId(Number(e.target.value)),
                        className: "w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none",
                        disabled: isProcessing
                    },
                    allTeams.sort((a,b) => a.name.localeCompare(b.name)).map(team => (
                        React.createElement("option", { key: team.id, value: team.id }, team.name)
                    ))
                )
            ),

            React.createElement(ControlGroup, { title: t('admin.budget'), description: t('admin.budget_desc') },
                React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement("input", {
                        type: "number", value: moneyAmount, onChange: e => setMoneyAmount(e.target.value),
                        className: "w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none",
                        disabled: isProcessing
                    }),
                    React.createElement("button", { onClick: () => onAdminMoneyChange(selectedTeamId, parseInt(moneyAmount, 10), 'set'), className: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50", disabled: isProcessing }, t('admin.set'))
                )
            ),
            React.createElement(ControlGroup, { title: t('admin.points'), description: t('admin.points_desc', { division: selectedTeam?.division || ''}) },
                 React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement("input", {
                        type: "number", value: pointsAmount, onChange: e => setPointsAmount(e.target.value),
                        className: "w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none",
                        disabled: isProcessing
                    }),
                    React.createElement("button", { onClick: () => onAdminPointsChange(selectedTeamId, parseInt(pointsAmount, 10), 'add'), className: "bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50", disabled: isProcessing }, t('admin.add')),
                    React.createElement("button", { onClick: () => onAdminPointsChange(selectedTeamId, parseInt(pointsAmount, 10), 'set'), className: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50", disabled: isProcessing }, t('admin.set'))
                )
            ),
            React.createElement(ControlGroup, { title: t('admin.bulk_skill'), description: t('admin.bulk_skill_desc') },
                 React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement("input", {
                        type: "number", value: bulkSkillAmount, onChange: e => setBulkSkillAmount(e.target.value), min: "1", max: "99",
                        className: "w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none",
                        disabled: isProcessing
                    }),
                    React.createElement("div", { className: "flex-shrink-0 grid grid-cols-3 gap-2" },
                        React.createElement("button", { onClick: () => onAdminBulkSkillChange(selectedTeamId, parseInt(bulkSkillAmount, 10), 'add'), className: "bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-md disabled:opacity-50 text-sm", disabled: isProcessing }, "+"),
                        React.createElement("button", { onClick: () => onAdminBulkSkillChange(selectedTeamId, -parseInt(bulkSkillAmount, 10), 'add'), className: "bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md disabled:opacity-50 text-sm", disabled: isProcessing }, "-"),
                        React.createElement("button", { onClick: () => onAdminBulkSkillChange(selectedTeamId, parseInt(bulkSkillAmount, 10), 'set'), className: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-md disabled:opacity-50 text-sm", disabled: isProcessing }, t('admin.set'))
                    )
                )
            ),
        )
    );
};

const PlayerCheatsTab = ({ allTeams, isProcessing, onAdminPlayerAttributeChange }) => {
    const { t } = useI18n();
    const [selectedTeamId, setSelectedTeamId] = useState(allTeams[0]?.id || null);
    const [selectedPlayerId, setSelectedPlayerId] = useState(null);
    const [playerSkill, setPlayerSkill] = useState('');
    const [playerAge, setPlayerAge] = useState('');

    const selectedTeamPlayers = useMemo(() => {
        if (!selectedTeamId) return [];
        const team = allTeams.find(t => t.id === selectedTeamId);
        return team ? team.players.sort((a,b) => a.name.localeCompare(b.name)) : [];
    }, [allTeams, selectedTeamId]);
    
    useEffect(() => {
        if (selectedTeamPlayers.length > 0) {
            const firstPlayer = selectedTeamPlayers[0];
            setSelectedPlayerId(firstPlayer.id);
            setPlayerSkill(firstPlayer.skill);
            setPlayerAge(firstPlayer.age);
        } else {
            setSelectedPlayerId(null);
        }
    }, [selectedTeamId]);
    
    const handlePlayerSelect = (playerId) => {
        const player = selectedTeamPlayers.find(p => p.id === Number(playerId));
        if (player) {
            setSelectedPlayerId(player.id);
            setPlayerSkill(player.skill);
            setPlayerAge(player.age);
        }
    };
    
    const handleSaveChanges = () => {
        onAdminPlayerAttributeChange(selectedPlayerId, selectedTeamId, 'skill', parseInt(playerSkill, 10));
        onAdminPlayerAttributeChange(selectedPlayerId, selectedTeamId, 'age', parseInt(playerAge, 10));
    };

    return (
        React.createElement("div", { className: "space-y-4" },
            React.createElement(ControlGroup, { title: t('admin.edit_player'), description: t('admin.edit_player_desc') },
                React.createElement("select",
                    {
                        value: selectedTeamId || '',
                        onChange: e => setSelectedTeamId(Number(e.target.value)),
                        className: "w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none",
                        disabled: isProcessing
                    },
                    allTeams.sort((a,b) => a.name.localeCompare(b.name)).map(team => (
                        React.createElement("option", { key: team.id, value: team.id }, team.name)
                    ))
                ),
                React.createElement("select",
                    {
                        value: selectedPlayerId || '',
                        onChange: e => handlePlayerSelect(e.target.value),
                        className: "w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none",
                        disabled: isProcessing || selectedTeamPlayers.length === 0
                    },
                    selectedTeamPlayers.map(player => (
                        React.createElement("option", { key: player.id, value: player.id }, `${player.name} (Hab: ${player.skill}, Idade: ${player.age})`)
                    ))
                ),
                React.createElement("div", { className: "grid grid-cols-2 gap-4" },
                    React.createElement("div", null,
                        React.createElement("label", { className: "text-sm text-gray-400" }, t('admin.skill')),
                        React.createElement("input", { type: "number", value: playerSkill, onChange: e => setPlayerSkill(e.target.value), min: 1, max: 99, className: "w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mt-1", disabled: !selectedPlayerId || isProcessing })
                    ),
                    React.createElement("div", null,
                        React.createElement("label", { className: "text-sm text-gray-400" }, t('admin.age')),
                        React.createElement("input", { type: "number", value: playerAge, onChange: e => setPlayerAge(e.target.value), min: 16, max: 50, className: "w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 mt-1", disabled: !selectedPlayerId || isProcessing })
                    )
                ),
                React.createElement("button", { onClick: handleSaveChanges, className: "w-full bg-blue-600 hover:bg-blue-700 font-bold py-2 rounded-md disabled:opacity-50", disabled: !selectedPlayerId || isProcessing }, t('admin.save_changes'))
            )
        )
    );
};

const ProgressionCheatsTab = ({ isProcessing, onAdvanceRounds, onSkipKnockoutStage, onFastForwardToEndOfSeason }) => {
    const { t } = useI18n();
    const [roundsToAdvance, setRoundsToAdvance] = useState(1);
    
    return (
        React.createElement("div", { className: "space-y-4" },
            React.createElement(ControlGroup, { title: t('admin.advance_rounds'), description: t('admin.advance_rounds_desc') },
                React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement("input", { type: "number", value: roundsToAdvance, onChange: e => setRoundsToAdvance(Number(e.target.value)), min: 1, className: "w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2", disabled: isProcessing }),
                    React.createElement("button", { onClick: () => onAdvanceRounds(roundsToAdvance), className: "w-full bg-blue-600 hover:bg-blue-700 font-bold py-2 rounded-md disabled:opacity-50", disabled: isProcessing }, t('admin.advance'))
                )
            ),
             React.createElement(ControlGroup, { title: t('admin.advance_knockouts'), description: t('admin.advance_knockouts_desc') },
                React.createElement("button", { onClick: onSkipKnockoutStage, className: "w-full bg-blue-600 hover:bg-blue-700 font-bold py-2 rounded-md disabled:opacity-50", disabled: isProcessing }, t('admin.simulate_stage'))
            ),
             React.createElement(ControlGroup, { title: t('admin.finish_season'), description: t('admin.finish_season_desc') },
                React.createElement("button", { onClick: onFastForwardToEndOfSeason, className: "w-full bg-red-600 hover:bg-red-700 font-bold py-2 rounded-md disabled:opacity-50", disabled: isProcessing }, t('admin.finish_season_button'))
            )
        )
    );
}


export const SettingsModal = ({ 
    isOpen, onClose, allTeams, onAdminMoneyChange, onAdminPointsChange, 
    onAdminPlayerAttributeChange, onAdminBulkSkillChange, isProcessing, onAdvanceRounds,
    onSkipKnockoutStage, onFastForwardToEndOfSeason
}) => {
    const { t } = useI18n();
    const [activeTab, setActiveTab] = useState('team');

    if (!isOpen) return null;
    
    return (
        React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" },
            React.createElement("div", { className: "bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-auto flex flex-col max-h-[90vh]" },
                React.createElement("div", { className: "p-4 border-b border-gray-700 relative flex justify-between items-center flex-shrink-0" },
                    React.createElement("h2", { className: "text-xl font-bold text-white flex items-center gap-2" }, 
                        React.createElement(Cog6ToothIcon, {className: "w-6 h-6"}),
                        t('dashboard.admin_panel')
                    ),
                    React.createElement("button", { onClick: onClose, className: "text-gray-400 hover:text-white" },
                        React.createElement(XMarkIcon, { className: "w-6 h-6" })
                    )
                ),

                React.createElement("nav", { className: "flex-shrink-0 flex justify-around border-b border-gray-700" },
                    React.createElement(TabButton, { id: 'team', label: t('admin.team'), activeTab: activeTab, onSelect: setActiveTab, icon: React.createElement(UsersIcon, { className: "w-5 h-5" }) }),
                    React.createElement(TabButton, { id: 'player', label: t('admin.player'), activeTab: activeTab, onSelect: setActiveTab, icon: React.createElement(UsersIcon, { className: "w-5 h-5" }) }),
                    React.createElement(TabButton, { id: 'progression', label: t('admin.progression'), activeTab: activeTab, onSelect: setActiveTab, icon: React.createElement(ForwardIcon, { className: "w-5 h-5" }) })
                ),
                
                React.createElement("div", { className: "p-4 sm:p-6 space-y-6 overflow-y-auto" },
                    activeTab === 'team' && React.createElement(TeamCheatsTab, { allTeams, isProcessing, onAdminMoneyChange, onAdminPointsChange, onAdminBulkSkillChange }),
                    activeTab === 'player' && React.createElement(PlayerCheatsTab, { allTeams, isProcessing, onAdminPlayerAttributeChange }),
                    activeTab === 'progression' && React.createElement(ProgressionCheatsTab, { isProcessing, onAdvanceRounds, onSkipKnockoutStage, onFastForwardToEndOfSeason })
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
