
import React, { useState } from 'react';
import LogoDisplay from './LogoDisplay.js';
import { XMarkIcon } from './icons/Icons.jsx';
import { useI18n } from '../lib/i18n.js';

const SwitchTeamConfirmationModal = ({ newTeam, oldTeamName, onClose, onConfirm }) => {
    const { t } = useI18n();
    return (
        React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" },
            React.createElement("div", { className: "bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-auto overflow-hidden" },
                React.createElement("div", { className: "p-4 border-b border-gray-700 relative flex justify-between items-center" },
                    React.createElement("h2", { className: "text-xl font-bold text-white" }, t('job.confirm_switch_title')),
                    React.createElement("button", { onClick: onClose, className: "text-gray-400 hover:text-white" },
                        React.createElement(XMarkIcon, { className: "w-6 h-6" })
                    )
                ),
                React.createElement("div", { className: "p-6 space-y-4 text-center" },
                    React.createElement("p", { className: "text-gray-300" },
                        t('job.confirm_switch_body', { oldTeamName: oldTeamName, newTeamName: newTeam.name })
                    ),
                    React.createElement("p", { className: "text-yellow-400 text-sm" },
                        t('job.confirm_switch_warning')
                    )
                ),
                React.createElement("div", { className: "p-4 bg-gray-900/50 flex justify-end space-x-4" },
                    React.createElement("button", { onClick: onClose, className: "bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors" },
                        t('cancel')
                    ),
                    React.createElement("button", { onClick: onConfirm, className: "bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors" },
                        t('confirm')
                    )
                )
            )
        )
    );
};

const JobMarket = ({ allTeams, userTeamId, onSwitchTeam }) => {
    const { t } = useI18n();
    const [teamToSwitch, setTeamToSwitch] = useState(null);

    const availableJobs = allTeams.filter(t => t.id !== userTeamId).sort((a,b) => b.skill - a.skill);
    const userTeam = allTeams.find(t => t.id === userTeamId);

    const handleConfirmSwitch = () => {
        if (teamToSwitch) {
            onSwitchTeam(teamToSwitch.id);
            setTeamToSwitch(null);
        }
    };

    return (
        React.createElement("div", { className: "space-y-6" },
            React.createElement("div", { className: "bg-gray-800 p-4 rounded-lg" },
                React.createElement("h2", { className: "text-xl font-semibold text-center text-white" }, t('job.career_opportunities')),
                React.createElement("p", { className: "text-center text-gray-400" }, t('job.description'))
            ),
            
            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" },
                availableJobs.map(team => (
                    React.createElement("div", { key: team.id, className: "bg-gray-800 p-4 rounded-lg flex flex-col items-center text-center transition-all duration-200 hover:shadow-lg hover:ring-2 hover:ring-blue-500" },
                        React.createElement(LogoDisplay, { team: team, style: "emoji", className: "text-6xl mb-2" }),
                        React.createElement("h3", { className: "text-lg font-bold" }, team.name),
                        React.createElement("p", { className: "text-sm text-gray-400" }, `${t('job.division')}: ${team.division}`),
                        React.createElement("p", { className: "text-sm text-gray-400" }, `${t('job.avg_skill')}: ${team.skill}`),
                        React.createElement("button", 
                            { 
                                onClick: () => setTeamToSwitch(team),
                                className: "mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition-transform hover:scale-105 flex items-center justify-center"
                            },
                            t('job.become_manager')
                        )
                    )
                ))
            ),

            teamToSwitch && userTeam && (
                React.createElement(SwitchTeamConfirmationModal, {
                    newTeam: teamToSwitch,
                    oldTeamName: userTeam.name,
                    onClose: () => setTeamToSwitch(null),
                    onConfirm: handleConfirmSwitch
                })
            )
        )
    );
};

export default JobMarket;
