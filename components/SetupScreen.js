import React, { useState } from 'react';
import UpdatesModal from './UpdatesModal.js';
import { useI18n } from '../lib/i18n.js';
import { LanguageIcon } from './icons/Icons.jsx';

const SetupScreen = ({ onStartGame, teams, onShowImportModal }) => {
    const { t, locale, setLocale, availableLocales } = useI18n();
    const [name, setName] = useState('');
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [error, setError] = useState('');
    const [isUpdatesModalOpen, setIsUpdatesModalOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);

    const handleSubmit = () => {
        if (!name.trim()) {
            setError(t('setup.error.no_name'));
            return;
        }
        if (!selectedTeam) {
            setError(t('setup.error.no_team'));
            return;
        }
        setError('');
        onStartGame(name, selectedTeam);
    };

    const handleTeamSelect = (e) => {
        const teamId = e.target.value;
        if (teamId) {
            const team = teams.find(t => t.id === parseInt(teamId, 10));
            setSelectedTeam(team);
        } else {
            setSelectedTeam(null);
        }
    };

    const renderTeamDropdown = (division, title) => (
        React.createElement("div", { className: "mb-4" },
            React.createElement("label", { htmlFor: `team-select-${division}`, className: "block text-sm font-medium text-gray-300 mb-2" }, title),
            React.createElement("select", {
                id: `team-select-${division}`,
                onChange: handleTeamSelect,
                value: selectedTeam?.division === division ? selectedTeam.id : '',
                className: "w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            },
                React.createElement("option", { value: "" }, `-- ${t('setup.select_team_placeholder')} --`),
                teams.filter(t => t.division === division).map(team => (
                    React.createElement("option", { key: team.id, value: team.id }, `\u00A0 ${team.emoji} ${team.name} (${t('setup.skill_abbr')} ${team.skill})`)
                ))
            )
        )
    );


    return (
        React.createElement("div", { className: "min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900" },
            React.createElement("div", { className: "w-full max-w-4xl mx-auto bg-gray-800 shadow-2xl rounded-lg p-8 space-y-8 relative" },
                React.createElement("div", { className: "absolute top-4 right-4" },
                   React.createElement("div", { className: "relative" },
                        React.createElement("button", {
                            onClick: () => setIsLangOpen(prev => !prev),
                            className: "flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors",
                            title: t('setup.language_toggle')
                        },
                            React.createElement(LanguageIcon, { className: "w-5 h-5" }),
                            React.createElement("span", null, locale.toUpperCase().split('-')[0])
                        ),
                        isLangOpen && React.createElement("div", { className: "absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-20" },
                            Object.entries(availableLocales).map(([code, name]) => (
                                React.createElement("button", {
                                    key: code,
                                    onClick: () => { setLocale(code); setIsLangOpen(false); },
                                    className: `w-full text-left px-4 py-2 text-sm ${locale === code ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-gray-600'}`
                                }, name)
                            ))
                        )
                    )
                ),
                React.createElement("div", { className: "text-center" },
                    React.createElement("h1", { className: "text-3xl md:text-4xl font-bold text-white mb-2" }, t('app.title')),
                    React.createElement("p", { className: "text-lg text-gray-400" }, t('setup.subtitle'))
                ),
                
                React.createElement("div", { className: "space-y-4" },
                    React.createElement("label", { htmlFor: "manager-name", className: "block text-sm font-medium text-gray-300" }, t('setup.manager_name_label')),
                    React.createElement("input", {
                        id: "manager-name",
                        type: "text",
                        value: name,
                        onChange: (e) => setName(e.target.value),
                        placeholder: t('setup.manager_name_placeholder'),
                        className: "w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    })
                ),

                React.createElement("div", null,
                    React.createElement("h2", { className: "text-2xl font-bold text-white mb-4" }, t('setup.choose_team_title')),
                    React.createElement("p", { className: "text-gray-400 mb-4 -mt-2 text-sm" }, t('setup.choose_team_subtitle')),
                    renderTeamDropdown('MSSL', t('setup.division.MSSL')),
                    renderTeamDropdown('ISL', t('setup.division.ISL')),
                    renderTeamDropdown('LA', t('setup.division.LA'))
                ),

                error && React.createElement("p", { className: "text-red-400 text-center" }, error),
                
                React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                    React.createElement("button", {
                        onClick: handleSubmit,
                        disabled: !name || !selectedTeam,
                        className: "w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-200 md:col-span-2"
                    }, t('setup.start_button')),
                    React.createElement("button", {
                        onClick: onShowImportModal,
                        className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-200"
                    }, t('setup.import_button')),
                    React.createElement("button", {
                        onClick: () => setIsUpdatesModalOpen(true),
                        className: "w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-200"
                    }, t('setup.updates_button'))
                )
            ),
            isUpdatesModalOpen && React.createElement(UpdatesModal, {
                onClose: () => setIsUpdatesModalOpen(false)
            })
        )
    );
};

export default SetupScreen;